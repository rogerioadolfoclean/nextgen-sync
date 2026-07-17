import "server-only";
import { Pool } from "pg";

/**
 * Connexion PostgreSQL (Neon).
 *
 * Le pool est mis en cache sur globalThis : en developpement, Next.js recharge
 * les modules a chaque modification et creerait sinon un nouveau pool a chaque
 * fois, jusqu'a saturer les connexions de Neon.
 *
 * Tant que DATABASE_URL n'est pas renseignee, `hasDatabase` vaut false et les
 * couches de donnees retombent sur le contenu du mockup (mode demo). Il suffit
 * d'ajouter l'URL pour brancher la vraie base sans toucher au reste du code.
 */
const globalForDb = globalThis as unknown as { nextgenPool?: Pool };

export const hasDatabase = Boolean(process.env.DATABASE_URL);

export const pool = hasDatabase
  ? (globalForDb.nextgenPool ??
    new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      max: 8,
      idleTimeoutMillis: 30_000,
    }))
  : null;

if (pool && process.env.NODE_ENV !== "production") {
  globalForDb.nextgenPool = pool;
}

/** Execute une requete et renvoie les lignes typees. */
export async function query<T = Record<string, unknown>>(
  text: string,
  params?: unknown[],
): Promise<T[]> {
  if (!pool) throw new Error("DATABASE_URL manquante : base non configuree.");
  const res = await pool.query(text, params as never[]);
  return res.rows as T[];
}

/** Execute une requete et renvoie la premiere ligne, ou null. */
export async function queryOne<T = Record<string, unknown>>(
  text: string,
  params?: unknown[],
): Promise<T | null> {
  const rows = await query<T>(text, params);
  return rows[0] ?? null;
}
