/**
 * Applique les fichiers .sql du dossier db/ dans l'ordre, une seule fois
 * chacun (suivi dans la table _migrations).
 *
 * Usage : npm run db:migrate
 */
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const here = dirname(fileURLToPath(import.meta.url));

const url = process.env.DATABASE_URL ?? lireEnv();
function lireEnv() {
  for (const f of [".env.local", ".env"]) {
    try {
      const txt = readFileSync(join(here, "..", f), "utf8");
      const m = txt.match(/^DATABASE_URL\s*=\s*"?([^"\n\r]+)"?/m);
      if (m) return m[1].trim();
    } catch {
      /* fichier absent, on essaie le suivant */
    }
  }
  throw new Error("DATABASE_URL introuvable (.env.local ou .env)");
}

const client = new pg.Client({
  connectionString: url,
  ssl: { rejectUnauthorized: false },
});
await client.connect();

await client.query(`
  CREATE TABLE IF NOT EXISTS _migrations (
    nom         TEXT PRIMARY KEY,
    applique_le TIMESTAMPTZ NOT NULL DEFAULT now()
  )
`);

const { rows: deja } = await client.query("SELECT nom FROM _migrations");
const appliquees = new Set(deja.map((r) => r.nom));

const fichiers = readdirSync(here)
  .filter((f) => f.endsWith(".sql"))
  .sort();

let n = 0;
for (const f of fichiers) {
  if (appliquees.has(f)) continue;
  const sql = readFileSync(join(here, f), "utf8");
  process.stdout.write(`→ ${f} ... `);
  await client.query("BEGIN");
  try {
    await client.query(sql);
    await client.query("INSERT INTO _migrations(nom) VALUES ($1)", [f]);
    await client.query("COMMIT");
    console.log("ok");
    n++;
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("ECHEC\n", err.message);
    process.exit(1);
  }
}

console.log(n === 0 ? "Rien a appliquer." : `${n} migration(s) appliquee(s).`);
await client.end();
