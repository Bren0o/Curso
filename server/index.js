// Jornada Backend — servidor: OAuth GitHub + sessões + progresso no PostgreSQL
import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import crypto from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const {
  DATABASE_URL,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  PORT = 3000,
  NODE_ENV = "development",
} = process.env;

if (!DATABASE_URL) {
  console.error("DATABASE_URL não definida — copie .env.example para .env e preencha");
  process.exit(1);
}

const pool = new pg.Pool({ connectionString: DATABASE_URL });
const app = express();
const producao = NODE_ENV === "production";
const SESSAO_DIAS = 30;

// Atrás do proxy reverso da host: respeita X-Forwarded-Proto (https)
app.set("trust proxy", true);

// URL pública descoberta da própria requisição — sem variável de ambiente;
// se o domínio mudar, o callback do OAuth se adapta sozinho.
// Cobre proxies que usam X-Forwarded-Host e os que preservam o Host.
const urlBase = (req) => {
  const host = (req.get("x-forwarded-host") || req.get("host")).split(",")[0].trim();
  return `${req.protocol}://${host}`;
};

app.use(express.json({ limit: "32kb" }));
app.use(cookieParser());

// Headers de segurança básicos (HSTS fica no NGINX, junto do TLS)
app.use((req, res, next) => {
  res.set({
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Content-Security-Policy":
      "default-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; script-src 'self'",
  });
  next();
});

const hash = (s) => crypto.createHash("sha256").update(s).digest("hex");

// Envolve handlers async para erros caírem no tratador do Express
const seguro = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

const cookieOpts = {
  httpOnly: true,
  secure: producao,
  sameSite: "lax", // Lax: sobrevive ao redirect do OAuth e bloqueia PUT/POST cross-site
  path: "/",
};

// ── Middleware: resolve o usuário da sessão (se houver) ──
const comUsuario = seguro(async (req, _res, next) => {
  req.user = null;
  const token = req.cookies.sessao;
  if (token) {
    const { rows } = await pool.query(
      `select u.id, u.username from sessoes s
         join usuarios u on u.id = s.user_id
        where s.token_hash = $1 and s.expira_em > now()`,
      [hash(token)]
    );
    req.user = rows[0] || null;
  }
  next();
});

const exigeLogin = (req, res, next) => {
  if (!req.user) return res.status(401).json({ erro: "não autenticado" });
  next();
};

// ── OAuth GitHub ──
app.get("/api/auth/github", (req, res) => {
  if (!GITHUB_CLIENT_ID) return res.status(503).send("login não configurado");
  const state = crypto.randomBytes(16).toString("hex");
  res.cookie("oauth_state", state, { ...cookieOpts, maxAge: 10 * 60 * 1000 });
  const params = new URLSearchParams({
    client_id: GITHUB_CLIENT_ID,
    redirect_uri: `${urlBase(req)}/api/auth/github/callback`,
    state,
  });
  res.redirect(`https://github.com/login/oauth/authorize?${params}`);
});

app.get(
  "/api/auth/github/callback",
  seguro(async (req, res) => {
    const { code, state } = req.query;
    // state confere com o cookie → bloqueia CSRF no fluxo OAuth
    if (!code || !state || state !== req.cookies.oauth_state) {
      return res.status(403).send("estado OAuth inválido — tente logar de novo");
    }
    res.clearCookie("oauth_state", cookieOpts);

    // Troca o code pelo access token (client secret só existe aqui, no servidor)
    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: `${urlBase(req)}/api/auth/github/callback`,
      }),
    });
    const { access_token } = await tokenRes.json();
    if (!access_token) return res.status(401).send("falha na autenticação com o GitHub");

    const ghRes = await fetch("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${access_token}`, "User-Agent": "jornada-backend" },
    });
    const gh = await ghRes.json();
    if (!gh.id) return res.status(401).send("falha ao obter usuário do GitHub");

    const { rows } = await pool.query(
      `insert into usuarios (github_id, username, avatar_url)
       values ($1, $2, $3)
       on conflict (github_id) do update
         set username = excluded.username, avatar_url = excluded.avatar_url
       returning id`,
      [gh.id, gh.login, gh.avatar_url]
    );

    // Sessão opaca: token aleatório no cookie, só o hash vai para o banco
    const token = crypto.randomBytes(32).toString("hex");
    await pool.query(
      `insert into sessoes (token_hash, user_id, expira_em)
       values ($1, $2, now() + ($3 || ' days')::interval)`,
      [hash(token), rows[0].id, SESSAO_DIAS]
    );
    // higiene: aproveita o login para limpar sessões vencidas
    pool.query(`delete from sessoes where expira_em < now()`).catch(() => {});

    res.cookie("sessao", token, { ...cookieOpts, maxAge: SESSAO_DIAS * 24 * 3600 * 1000 });
    res.redirect("/");
  })
);

app.post(
  "/api/auth/logout",
  comUsuario,
  seguro(async (req, res) => {
    const token = req.cookies.sessao;
    if (token) await pool.query(`delete from sessoes where token_hash = $1`, [hash(token)]);
    res.clearCookie("sessao", cookieOpts);
    res.json({ ok: true });
  })
);

// ── API ──
app.get("/api/me", comUsuario, (req, res) => {
  if (!req.user) return res.status(401).json({ user: null });
  res.json({ user: { username: req.user.username } });
});

app.get(
  "/api/progresso",
  comUsuario,
  exigeLogin,
  seguro(async (req, res) => {
    const { rows } = await pool.query(
      `select feitas, hora from progresso where user_id = $1`,
      [req.user.id]
    );
    res.json(rows[0] || { feitas: {}, hora: null });
  })
);

app.put(
  "/api/progresso",
  comUsuario,
  exigeLogin,
  seguro(async (req, res) => {
    const { feitas, hora } = req.body || {};
    const idsValidos =
      feitas !== null &&
      typeof feitas === "object" &&
      !Array.isArray(feitas) &&
      Object.keys(feitas).length <= 200 &&
      Object.entries(feitas).every(([id, v]) => /^f\d{1,2}m\d{1,2}$/.test(id) && v === true);
    const horaValida = typeof hora === "string" && /^([01]\d|2[0-3]):[0-5]\d$/.test(hora);
    if (!idsValidos || !horaValida) return res.status(400).json({ erro: "payload inválido" });

    await pool.query(
      `insert into progresso (user_id, feitas, hora, updated_at)
       values ($1, $2, $3, now())
       on conflict (user_id) do update
         set feitas = excluded.feitas, hora = excluded.hora, updated_at = now()`,
      [req.user.id, JSON.stringify(feitas), hora]
    );
    res.json({ ok: true });
  })
);

// ── Frontend estático (dist/ gerado pelo vite build) ──
const dist = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "dist");
app.use(express.static(dist));
app.get("*", (_req, res) => res.sendFile(path.join(dist, "index.html")));

// Tratador de erros: loga no servidor, resposta genérica para o cliente
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ erro: "erro interno" });
});

app.listen(PORT, () => {
  console.log(`jornada-backend rodando na porta ${PORT} (${NODE_ENV})`);
});
