import { useState, useEffect, useMemo } from "react";
import { api } from "./api.js";

// ─────────────────────────────────────────────────────────────
// JORNADA BACKEND — mapa prático do Breno
// Estética: terminal âmbar (CRT) — porque a jornada dele vive no servidor
// ─────────────────────────────────────────────────────────────

const FASES = [
  {
    id: "f1",
    tag: "FASE 1",
    emoji: "⚡",
    titulo: "JavaScript prático no Node",
    semanas: "Semanas 1–5",
    curso: {
      nome: "Otávio Miranda — JS e TS do básico ao avançado (Udemy)",
      url: "https://www.udemy.com/course/curso-de-javascript-moderno-do-basico-ao-avancado/",
    },
    pular: "Pule TODAS as seções de DOM, eventos de navegador e projetos de front.",
    lore: "Sem teoria solta: cada aula, código digitado junto. Rodando no Node, não no navegador.",
    criterio: "Saída: escrever uma função com map/filter/async sem copiar de lugar nenhum.",
    missoes: [
      { id: "f1m1", nome: "Setup + variáveis, tipos e operadores no Node", xp: 50 },
      { id: "f1m2", nome: "Funções, arrow functions e escopo", xp: 50 },
      { id: "f1m3", nome: "Arrays e objetos: map, filter, reduce", xp: 50 },
      { id: "f1m4", nome: "Spread/rest, destructuring e módulos", xp: 50 },
      { id: "f1m5", nome: "Classes, POO básica, Promises e async/await", xp: 100 },
      { id: "f1m6", nome: "CHECKPOINT (fim da semana 2): função que recebe um array, filtra os pares e soma — sozinho, sem Claude e sem Google", xp: 50 },
    ],
  },
  {
    id: "f2",
    tag: "FASE 2",
    emoji: "🛡️",
    titulo: "TypeScript",
    semanas: "Semanas 6–9",
    curso: {
      nome: "Mesmo curso (seção de TS) + Glaucia Lemos como apoio",
      url: "https://www.youtube.com/playlist?list=PLb2HQ45KP0Wsk-p_0c6ImqBAEFEY-LU6H",
    },
    pular: "Nada de TS pra React aqui — só TS puro e TS no Node.",
    lore: "A armadura do servidor. Cada conceito novo, abra um arquivo do ErexHost e ache o padrão lá.",
    criterio: "Saída: abrir um type do backend do ErexHost e explicar em voz alta o que ele faz.",
    missoes: [
      { id: "f2m1", nome: "tsconfig + tipos primitivos e inferência", xp: 50 },
      { id: "f2m2", nome: "Interfaces, type aliases e union types", xp: 50 },
      { id: "f2m3", nome: "Generics e utility types", xp: 75 },
      { id: "f2m4", nome: "Âncora: achar 5 padrões aprendidos no código do ErexHost", xp: 125 },
    ],
  },
  {
    id: "f3",
    tag: "FASE 3",
    emoji: "🌐",
    titulo: "Node, Express e API REST",
    semanas: "Semanas 10–15",
    curso: {
      nome: "Mesmo curso (seções de backend: Node, Express, bancos)",
      url: "https://www.udemy.com/course/curso-de-javascript-moderno-do-basico-ao-avancado/",
    },
    pular: "Pule React, Webpack, Next.js e Strapi. Backend só.",
    lore: "Aqui você cruza com o que já roda em produção. O ErexHost vira seu laboratório.",
    criterio: "Saída: ler um stack trace e apontar arquivo + linha do problema ANTES de mandar pro Claude.",
    missoes: [
      { id: "f3m1", nome: "Servidor HTTP nativo do Node + npm", xp: 50 },
      { id: "f3m2", nome: "Express: rotas e middlewares", xp: 75 },
      { id: "f3m3", nome: "Organização MVC + validação de dados", xp: 75 },
      { id: "f3m4", nome: "Autenticação com JWT", xp: 75 },
      { id: "f3m5", nome: "Banco de dados no backend (PostgreSQL)", xp: 75 },
      { id: "f3m6", nome: "MISSÃO-OURO: reescrever GET /api/containers/:id do zero, sem copiar", xp: 150 },
    ],
  },
  {
    id: "f4",
    tag: "FASE 4",
    emoji: "💎",
    titulo: "SQL na prática",
    semanas: "Semanas 16–17",
    curso: {
      nome: "Sem curso: DBeaver aberto numa CÓPIA do erexhost.db",
      url: "https://dbeaver.io/download/",
    },
    pular: "Guanabara (SQL) só como apoio se travar em SELECT ou JOIN.",
    lore: "As gemas dormem no seu próprio banco. Por dia: 1 tabela, 3 queries.",
    criterio: "Saída: query juntando users + containers + teams sem ajuda nenhuma.",
    missoes: [
      { id: "f4m1", nome: "SELECT, WHERE e JOIN em tabelas reais (na cópia!)", xp: 75 },
      { id: "f4m2", nome: "QUERY FINAL: users + containers + teams, sozinho", xp: 125 },
    ],
  },
  {
    id: "f5",
    tag: "FASE 5",
    emoji: "🌿",
    titulo: "Git e Deploy de verdade",
    semanas: "Semanas 18–20",
    curso: {
      nome: "Mesmo curso (seções de Git, SSH e deploy em servidor Linux)",
      url: "https://www.udemy.com/course/curso-de-javascript-moderno-do-basico-ao-avancado/",
    },
    pular: "Pule a parte de deploy de projetos React/Next — só o deploy de API/backend importa.",
    lore: "O stack das aulas (Linux + NGINX + Let's Encrypt) é LITERALMENTE o do ErexHost. Você vai entender seu próprio servidor.",
    criterio: "Saída: explicar por que o ErexHost usa SCP do dist/ em vez de git pull no servidor.",
    missoes: [
      { id: "f5m1", nome: "Git além do commit: branches, merge, desfazer coisas (reset/revert)", xp: 50 },
      { id: "f5m2", nome: "Chaves SSH no servidor e no computador pessoal", xp: 50 },
      { id: "f5m3", nome: "NGINX como proxy reverso + HTTPS com Let's Encrypt", xp: 75 },
      { id: "f5m4", nome: "Continuous Deployment com GitHub Webhooks", xp: 50 },
      { id: "f5m5", nome: "MISSÃO-OURO: mapear o deploy real do ErexHost passo a passo e apontar 1 melhoria", xp: 100 },
    ],
  },
  {
    id: "f6",
    tag: "FASE 6",
    emoji: "🐋",
    titulo: "Docker por dentro",
    semanas: "Semanas 21–23",
    curso: {
      nome: "Docker Essencial (TechEduca, do mapa) como apoio — prática direto nos containers do ErexHost",
      url: "https://jornadadevheroi.netlify.app/",
    },
    pular: "Pule Docker Swarm e orquestração avançada — você não usa e não precisa agora.",
    lore: "Você já opera Docker em produção todo dia. Agora vai entender POR QUE ele funciona.",
    criterio: "Saída: ler um Dockerfile gerado pelo painel e explicar cada linha sem ajuda.",
    missoes: [
      { id: "f6m1", nome: "Conceitos: imagem vs container, layers, volumes e networks", xp: 50 },
      { id: "f6m2", nome: "Na prática: docker ps, logs, exec e inspect nos containers do ErexHost", xp: 75 },
      { id: "f6m3", nome: "MISSÃO-OURO: dissecar linha por linha um Dockerfile gerado pelo seu painel", xp: 125 },
    ],
  },
];

const NIVEIS = [
  { min: 0, nome: "Vibe Coder" },
  { min: 300, nome: "Aprendiz de Backend" },
  { min: 650, nome: "Caçador de Stack Trace" },
  { min: 1100, nome: "Guardião do ErexHost" },
  { min: 1500, nome: "Mestre do Deploy" },
  { min: 1925, nome: "Dev de Verdade™" },
];

const FORA_DO_MAPA = [
  "HTML/CSS e React — você odeia front; aprende sob demanda mexendo no painel",
  "Curso separado de lógica/algoritmos — o checkpoint da semana 2 cobre esse risco",
  "Docker Swarm e orquestração avançada — você não usa e não precisa",
  "Projeto Fullstack final — o ErexHost JÁ É seu projeto final",
];

const XP_TOTAL = FASES.reduce((t, f) => t + f.missoes.reduce((s, m) => s + m.xp, 0), 0);
const STORAGE_KEY = "jornada-backend-breno-v1";

function barraAscii(pct, largura = 22) {
  const cheio = Math.round((pct / 100) * largura);
  return "█".repeat(cheio) + "░".repeat(largura - cheio);
}

function linkCalendario(hora) {
  const [h, m] = hora.split(":").map(Number);
  const ini = new Date();
  ini.setDate(ini.getDate() + 1);
  ini.setHours(h, m, 0, 0);
  const fim = new Date(ini.getTime() + 30 * 60 * 1000);
  const fmt = (d) =>
    `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}T${String(d.getHours()).padStart(2, "0")}${String(d.getMinutes()).padStart(2, "0")}00`;
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: "⚡ Jornada Backend — 30 min",
    details:
      "Sessão diária da Jornada Backend.\nRegra: timer de 30 min, parou quando bater.\nPulou um dia? Segue do ponto, sem repor.\n\nCurso: https://www.udemy.com/course/curso-de-javascript-moderno-do-basico-ao-avancado/",
    recur: "RRULE:FREQ=DAILY",
    dates: `${fmt(ini)}/${fmt(fim)}`,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export default function JornadaBackend() {
  const [feitas, setFeitas] = useState({});
  const [carregando, setCarregando] = useState(true);
  const [erroSave, setErroSave] = useState(false);
  const [hora, setHora] = useState("20:00");
  const [confirmaReset, setConfirmaReset] = useState(false);
  const [user, setUser] = useState(null);
  const [apiDisponivel, setApiDisponivel] = useState(false);
  const [githubDisponivel, setGithubDisponivel] = useState(false);

  // Sessão no backend próprio (cookie HttpOnly) — opcional, app funciona sem
  useEffect(() => {
    api.me().then(({ disponivel, user: u }) => {
      setApiDisponivel(disponivel);
      setUser(u);
      if (disponivel) api.config().then(({ github }) => setGithubDisponivel(github));
    });
  }, []);

  // Ao logar: busca o progresso no servidor e mescla com o local (união — nunca perde nada)
  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const data = await api.carregarProgresso();
        const mescladas = { ...feitas, ...(data?.feitas || {}) };
        const horaFinal = data?.hora || hora;
        setFeitas(mescladas);
        setHora(horaFinal);
        salvar(mescladas, horaFinal, user);
      } catch (e) {
        setErroSave(true);
      }
    })();
    // roda só quando o usuário loga/desloga
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    try {
      const r = localStorage.getItem(STORAGE_KEY);
      if (r) {
        const dados = JSON.parse(r);
        setFeitas(dados.feitas || {});
        if (dados.hora) setHora(dados.hora);
      }
    } catch (e) {
      // primeira visita: sem dados salvos ainda
    } finally {
      setCarregando(false);
    }
  }, []);

  const salvar = (novasFeitas, novaHora, usuario = user) => {
    try {
      setErroSave(false);
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ feitas: novasFeitas, hora: novaHora })
      );
    } catch (e) {
      setErroSave(true);
    }
    if (usuario) {
      api
        .salvarProgresso(novasFeitas, novaHora)
        .then((res) => {
          if (!res.ok) setErroSave(true);
        })
        .catch(() => setErroSave(true));
    }
  };

  const [modoRegistro, setModoRegistro] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erroAuth, setErroAuth] = useState("");
  const [enviandoAuth, setEnviandoAuth] = useState(false);

  const enviarAuth = async (e) => {
    e.preventDefault();
    setErroAuth("");
    setEnviandoAuth(true);
    try {
      const u = modoRegistro
        ? await api.registrar(nome, email, senha)
        : await api.login(email, senha);
      setUser(u);
      setSenha("");
    } catch (err) {
      setErroAuth(err.message);
    } finally {
      setEnviandoAuth(false);
    }
  };

  const sair = async () => {
    await api.sair();
    setUser(null);
  };

  const alternar = (id) => {
    const novas = { ...feitas, [id]: !feitas[id] };
    if (!novas[id]) delete novas[id];
    setFeitas(novas);
    salvar(novas, hora);
  };

  const mudarHora = (v) => {
    setHora(v);
    salvar(feitas, v);
  };

  const resetar = () => {
    if (!confirmaReset) {
      setConfirmaReset(true);
      setTimeout(() => setConfirmaReset(false), 4000);
      return;
    }
    setFeitas({});
    setConfirmaReset(false);
    salvar({}, hora);
  };

  const xp = useMemo(
    () =>
      FASES.reduce(
        (t, f) => t + f.missoes.reduce((s, m) => s + (feitas[m.id] ? m.xp : 0), 0),
        0
      ),
    [feitas]
  );

  const nivel = useMemo(() => {
    let atual = NIVEIS[0];
    let proximo = null;
    for (let i = 0; i < NIVEIS.length; i++) {
      if (xp >= NIVEIS[i].min) atual = NIVEIS[i];
      else {
        proximo = NIVEIS[i];
        break;
      }
    }
    return { atual, proximo };
  }, [xp]);

  const pctGeral = Math.round((xp / XP_TOTAL) * 100);

  if (carregando) {
    return (
      <div style={st.shell}>
        <div style={{ ...st.mono, color: "#8A6D3F", padding: 40, textAlign: "center" }}>
          [ carregando progresso… ]
        </div>
      </div>
    );
  }

  return (
    <div style={st.shell}>
      <style>{`
        @keyframes blink { 0%,49% {opacity:1} 50%,100% {opacity:0} }
        .cursor { animation: blink 1.1s step-end infinite; }
        .missao:hover { background: rgba(255,180,84,0.07) !important; }
        .btn:hover { filter: brightness(1.18); }
        .btn:focus-visible, .missao:focus-visible { outline: 2px solid #FFB454; outline-offset: 2px; }
        @media (prefers-reduced-motion: reduce) { .cursor { animation: none; } }
      `}</style>

      {/* ── Cabeçalho terminal ── */}
      <div style={st.headerBar}>
        <span style={{ color: "#D96C4F" }}>●</span>
        <span style={{ color: "#FFB454" }}>●</span>
        <span style={{ color: "#7FB069" }}>●</span>
        <span style={{ ...st.mono, color: "#8A6D3F", marginLeft: 10, fontSize: 12 }}>
          breno@erexhost:~/jornada-backend
        </span>
      </div>

      <div style={st.body}>
        <div style={{ ...st.mono, color: "#8A6D3F", fontSize: 13 }}>$ ./iniciar-jornada --modo=pratico --pular=teoria</div>
        <h1 style={st.titulo}>
          JORNADA BACKEND<span className="cursor" style={{ color: "#FFB454" }}>_</span>
        </h1>
        <p style={st.subtitulo}>
          Mapa pessoal do Breno · 30 min/dia · 6 fases em ~23 semanas · ErexHost como laboratório
        </p>

        {/* ── Status do herói ── */}
        <div style={st.statusCard}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <div style={{ ...st.mono, fontSize: 13, color: "#EDE3D2" }}>
              NÍVEL: <span style={{ color: "#FFB454", fontWeight: 700 }}>{nivel.atual.nome}</span>
            </div>
            <div style={{ ...st.mono, fontSize: 13, color: "#EDE3D2" }}>
              XP: <span style={{ color: "#FFB454", fontWeight: 700 }}>{xp}</span>
              <span style={{ color: "#8A6D3F" }}> / {XP_TOTAL}</span>
            </div>
          </div>
          <div style={{ ...st.mono, fontSize: 14, color: "#FFB454", margin: "10px 0 4px", letterSpacing: 1, overflow: "hidden", whiteSpace: "nowrap" }}>
            [{barraAscii(pctGeral)}] {pctGeral}%
          </div>
          {nivel.proximo && (
            <div style={{ ...st.mono, fontSize: 11.5, color: "#8A6D3F" }}>
              próximo nível: {nivel.proximo.nome} aos {nivel.proximo.min} XP
            </div>
          )}
          {!nivel.proximo && xp >= XP_TOTAL && (
            <div style={{ ...st.mono, fontSize: 12.5, color: "#7FB069" }}>
              ✓ jornada completa. agora você sabe o que construiu.
            </div>
          )}
        </div>

        {/* ── Conta (sincronização no servidor) ── */}
        {apiDisponivel && (
          <div style={st.nuvemCard}>
            {user ? (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
                <span style={{ ...st.mono, fontSize: 12.5, color: "#7FB069" }}>
                  ☁ logado como {user.username} · progresso sincronizado
                </span>
                <button className="btn" onClick={sair} style={st.btnSair}>
                  sair
                </button>
              </div>
            ) : (
              <form onSubmit={enviarAuth}>
                <div style={{ ...st.mono, fontSize: 12, color: "#8A6D3F", marginBottom: 8 }}>
                  // {modoRegistro ? "crie sua conta" : "entre"} para salvar o progresso na nuvem
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                  {modoRegistro && (
                    <input
                      style={st.inputAuth}
                      placeholder="nome"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      required
                      maxLength={50}
                    />
                  )}
                  <input
                    style={st.inputAuth}
                    type="email"
                    placeholder="e-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                  <input
                    style={st.inputAuth}
                    type="password"
                    placeholder={modoRegistro ? "senha (mín. 8)" : "senha"}
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    required
                    minLength={modoRegistro ? 8 : undefined}
                    autoComplete={modoRegistro ? "new-password" : "current-password"}
                  />
                  <button className="btn" type="submit" disabled={enviandoAuth} style={st.btnAuth}>
                    {enviandoAuth ? "..." : modoRegistro ? "criar conta" : "entrar"}
                  </button>
                  <button
                    className="btn"
                    type="button"
                    onClick={() => {
                      setModoRegistro(!modoRegistro);
                      setErroAuth("");
                    }}
                    style={st.btnSair}
                  >
                    {modoRegistro ? "já tenho conta" : "criar conta"}
                  </button>
                  {githubDisponivel && (
                    <button
                      className="btn"
                      type="button"
                      onClick={() => api.entrarGitHub()}
                      style={st.btnGitHub}
                    >
                      ⎇ GitHub
                    </button>
                  )}
                </div>
                {erroAuth && (
                  <div style={{ ...st.mono, fontSize: 12, color: "#D96C4F", marginTop: 8 }}>
                    ! {erroAuth}
                  </div>
                )}
              </form>
            )}
          </div>
        )}

        {/* ── Agendar no calendário ── */}
        <div style={st.calCard}>
          <div style={{ ...st.mono, fontSize: 12, color: "#8A6D3F", marginBottom: 8 }}>
            // mesmo horário todo dia mata a procrastinação
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <label style={{ ...st.mono, fontSize: 13, color: "#EDE3D2" }}>
              Horário diário:{" "}
              <input
                type="time"
                value={hora}
                onChange={(e) => mudarHora(e.target.value)}
                style={st.inputHora}
              />
            </label>
            <a
              className="btn"
              href={linkCalendario(hora)}
              target="_blank"
              rel="noopener noreferrer"
              style={st.btnCal}
            >
              ＋ Agendar 30 min/dia no Google Calendar
            </a>
          </div>
        </div>

        {erroSave && (
          <div style={{ ...st.mono, fontSize: 12, color: "#D96C4F", marginBottom: 14 }}>
            ! falha ao salvar progresso — tente marcar de novo
          </div>
        )}

        {/* ── Fases ── */}
        {FASES.map((fase) => {
          const xpFase = fase.missoes.reduce((s, m) => s + m.xp, 0);
          const xpFeito = fase.missoes.reduce((s, m) => s + (feitas[m.id] ? m.xp : 0), 0);
          const completa = xpFeito === xpFase;
          const pct = Math.round((xpFeito / xpFase) * 100);
          return (
            <div key={fase.id} style={{ ...st.faseCard, borderColor: completa ? "#7FB069" : "#3A2F1F" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 6 }}>
                <div>
                  <span style={{ ...st.mono, fontSize: 11, color: completa ? "#7FB069" : "#FFB454", letterSpacing: 2 }}>
                    {fase.tag} {completa && "· ✓ CONCLUÍDA"}
                  </span>
                  <h2 style={st.faseTitulo}>
                    {fase.emoji} {fase.titulo}
                  </h2>
                </div>
                <span style={{ ...st.mono, fontSize: 12, color: "#8A6D3F" }}>{fase.semanas}</span>
              </div>

              <p style={st.lore}>{fase.lore}</p>

              <a href={fase.curso.url} target="_blank" rel="noopener noreferrer" style={st.cursoLink}>
                📺 {fase.curso.nome}
              </a>
              <div style={st.pularBox}>⛔ {fase.pular}</div>

              <div style={{ marginTop: 12 }}>
                {fase.missoes.map((m) => {
                  const ok = !!feitas[m.id];
                  return (
                    <button
                      key={m.id}
                      className="missao"
                      onClick={() => alternar(m.id)}
                      style={{ ...st.missao, opacity: ok ? 0.62 : 1 }}
                    >
                      <span style={{ ...st.mono, color: ok ? "#7FB069" : "#8A6D3F", fontSize: 15, flexShrink: 0 }}>
                        [{ok ? "x" : " "}]
                      </span>
                      <span style={{ ...st.missaoNome, textDecoration: ok ? "line-through" : "none" }}>
                        {m.nome}
                      </span>
                      <span style={{ ...st.mono, color: "#FFB454", fontSize: 12, flexShrink: 0 }}>
                        +{m.xp}xp
                      </span>
                    </button>
                  );
                })}
              </div>

              <div style={{ ...st.mono, fontSize: 11.5, color: "#8A6D3F", marginTop: 10 }}>
                🎯 {fase.criterio}
              </div>
              <div style={{ ...st.mono, fontSize: 12, color: completa ? "#7FB069" : "#FFB454", marginTop: 6, letterSpacing: 1 }}>
                [{barraAscii(pct, 16)}] {xpFeito}/{xpFase} xp
              </div>
            </div>
          );
        })}

        {/* ── Fora do mapa ── */}
        <div style={st.foraCard}>
          <div style={{ ...st.mono, fontSize: 11, color: "#8A6D3F", letterSpacing: 2, marginBottom: 8 }}>
            FORA DO MAPA (de propósito)
          </div>
          {FORA_DO_MAPA.map((t, i) => (
            <div key={i} style={{ ...st.mono, fontSize: 12.5, color: "#A89878", padding: "3px 0" }}>
              − {t}
            </div>
          ))}
        </div>

        {/* ── Regras ── */}
        <div style={st.regrasCard}>
          <div style={{ ...st.mono, fontSize: 11, color: "#D96C4F", letterSpacing: 2, marginBottom: 8 }}>
            REGRAS ANTI-PROCRASTINAÇÃO
          </div>
          <div style={st.regra}>1. Mesmo horário todo dia (use o botão do calendário aí em cima)</div>
          <div style={st.regra}>2. Timer de 30 min — bateu, parou. Mesmo no meio do vídeo.</div>
          <div style={st.regra}>3. Pulou um dia? Segue do ponto. Sem "repor" no sábado.</div>
          <div style={st.regra}>4. Sem caderno, sem Notion. O código que você digitou É a anotação.</div>
        </div>

        <button className="btn" onClick={resetar} style={{ ...st.btnReset, color: confirmaReset ? "#D96C4F" : "#8A6D3F", borderColor: confirmaReset ? "#D96C4F" : "#3A2F1F" }}>
          {confirmaReset ? "⚠ clique de novo para zerar TUDO" : "zerar progresso"}
        </button>

        <div style={{ ...st.mono, fontSize: 11, color: "#5C4B33", textAlign: "center", marginTop: 18 }}>
          {user ? "progresso sincronizado na nuvem ☁" : "progresso salvo neste navegador"} · feito para a jornada do Breno
        </div>
      </div>
    </div>
  );
}

const st = {
  shell: {
    minHeight: "100vh",
    background: "#14100B",
    backgroundImage: "repeating-linear-gradient(0deg, rgba(255,180,84,0.025) 0px, rgba(255,180,84,0.025) 1px, transparent 1px, transparent 3px)",
    padding: "0 0 40px",
    fontFamily: "ui-monospace, 'Cascadia Code', 'JetBrains Mono', Menlo, Consolas, monospace",
  },
  mono: {
    fontFamily: "ui-monospace, 'Cascadia Code', 'JetBrains Mono', Menlo, Consolas, monospace",
  },
  headerBar: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "10px 18px",
    background: "#0E0B07",
    borderBottom: "1px solid #2A2216",
    fontSize: 13,
  },
  body: { maxWidth: 700, margin: "0 auto", padding: "26px 18px 0" },
  titulo: {
    fontFamily: "ui-monospace, Menlo, Consolas, monospace",
    fontSize: "clamp(26px, 6vw, 40px)",
    fontWeight: 800,
    color: "#EDE3D2",
    letterSpacing: 3,
    margin: "8px 0 4px",
    textShadow: "0 0 18px rgba(255,180,84,0.25)",
  },
  subtitulo: { fontSize: 13.5, color: "#A89878", margin: "0 0 22px", lineHeight: 1.5 },
  statusCard: {
    background: "#1A1410",
    border: "1px solid #FFB454",
    borderRadius: 8,
    padding: "16px 18px",
    marginBottom: 14,
    boxShadow: "0 0 24px rgba(255,180,84,0.08)",
  },
  nuvemCard: {
    background: "#16110C",
    border: "1px dashed #3A2F1F",
    borderRadius: 8,
    padding: "12px 18px",
    marginBottom: 14,
  },
  inputAuth: {
    background: "#0E0B07",
    border: "1px solid #3A2F1F",
    borderRadius: 5,
    color: "#EDE3D2",
    padding: "7px 10px",
    fontFamily: "inherit",
    fontSize: 13,
    minWidth: 0,
    flex: "1 1 120px",
  },
  btnAuth: {
    background: "#FFB454",
    color: "#14100B",
    fontWeight: 700,
    fontSize: 13,
    padding: "8px 14px",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  btnGitHub: {
    background: "#EDE3D2",
    color: "#14100B",
    fontWeight: 700,
    fontSize: 13,
    padding: "8px 14px",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  btnSair: {
    background: "transparent",
    color: "#8A6D3F",
    fontSize: 12,
    padding: "6px 12px",
    border: "1px solid #3A2F1F",
    borderRadius: 6,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  calCard: {
    background: "#16110C",
    border: "1px dashed #3A2F1F",
    borderRadius: 8,
    padding: "14px 18px",
    marginBottom: 22,
  },
  inputHora: {
    background: "#0E0B07",
    border: "1px solid #3A2F1F",
    borderRadius: 5,
    color: "#FFB454",
    padding: "5px 8px",
    fontFamily: "inherit",
    fontSize: 13,
  },
  btnCal: {
    display: "inline-block",
    background: "#FFB454",
    color: "#14100B",
    fontWeight: 700,
    fontSize: 13,
    padding: "9px 14px",
    borderRadius: 6,
    textDecoration: "none",
    fontFamily: "inherit",
  },
  faseCard: {
    background: "#1A1410",
    border: "1px solid #3A2F1F",
    borderRadius: 8,
    padding: "18px 18px 16px",
    marginBottom: 16,
  },
  faseTitulo: { fontSize: 19, fontWeight: 700, color: "#EDE3D2", margin: "4px 0 0" },
  lore: { fontSize: 13, color: "#A89878", fontStyle: "italic", margin: "10px 0", lineHeight: 1.55 },
  cursoLink: {
    display: "inline-block",
    fontSize: 12.5,
    color: "#FFB454",
    textDecoration: "underline",
    textUnderlineOffset: 3,
    marginBottom: 8,
    wordBreak: "break-word",
  },
  pularBox: {
    fontSize: 12,
    color: "#D96C4F",
    background: "rgba(217,108,79,0.08)",
    border: "1px solid rgba(217,108,79,0.25)",
    borderRadius: 5,
    padding: "7px 10px",
    marginTop: 4,
  },
  missao: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    width: "100%",
    background: "transparent",
    border: "none",
    borderBottom: "1px solid #221B12",
    padding: "9px 4px",
    cursor: "pointer",
    textAlign: "left",
    borderRadius: 4,
  },
  missaoNome: { flex: 1, fontSize: 13.5, color: "#EDE3D2", fontFamily: "inherit", lineHeight: 1.4 },
  foraCard: {
    background: "#16110C",
    border: "1px solid #2A2216",
    borderRadius: 8,
    padding: "14px 18px",
    marginBottom: 14,
  },
  regrasCard: {
    background: "rgba(217,108,79,0.05)",
    border: "1px solid rgba(217,108,79,0.25)",
    borderRadius: 8,
    padding: "14px 18px",
    marginBottom: 22,
  },
  regra: { fontSize: 12.5, color: "#C9B597", padding: "3px 0", fontFamily: "inherit" },
  btnReset: {
    display: "block",
    margin: "0 auto",
    background: "transparent",
    border: "1px solid #3A2F1F",
    borderRadius: 6,
    padding: "8px 16px",
    fontSize: 12,
    cursor: "pointer",
    fontFamily: "inherit",
  },
};
