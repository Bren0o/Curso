// Aplica o schema.sql no banco apontado por DATABASE_URL (.env)
import "dotenv/config";
import { readFileSync } from "node:fs";
import pg from "pg";

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL não definida — copie .env.example para .env e preencha");
  process.exit(1);
}

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const sql = readFileSync(new URL("./schema.sql", import.meta.url), "utf8");

try {
  await pool.query(sql);
  console.log("✓ schema aplicado com sucesso");
} finally {
  await pool.end();
}
