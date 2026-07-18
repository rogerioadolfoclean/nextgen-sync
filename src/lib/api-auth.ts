import "server-only";
import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { pool, hasDatabase } from "@/lib/db";

/**
 * API publique NextGen Sync — authentification par clé (Bearer).
 * Chaque développeur tiers reçoit une clé `ngs_live_…` ou `ngs_test_…`
 * et appelle /api/v1/* avec l'en-tête Authorization: Bearer <clé>.
 */
export type ApiContext = {
  keyId: string;
  ownerId: string | null;
  environment: "production" | "sandbox";
  scopes: string[];
};

export function jsonError(status: number, code: string, message: string) {
  return NextResponse.json({ error: { code, message } }, { status });
}

async function authenticate(req: NextRequest): Promise<ApiContext | null> {
  const header = req.headers.get("authorization") ?? "";
  const key = header.startsWith("Bearer ") ? header.slice(7).trim() : null;
  if (!key) return null;
  const hash = crypto.createHash("sha256").update(key).digest("hex");
  const rows = await pool!.query(
    `SELECT id, owner_id, environment, scopes FROM api_keys WHERE key_hash = $1 AND active = true`,
    [hash]
  );
  const k = rows.rows[0];
  if (!k) return null;
  await pool!.query(`UPDATE api_keys SET last_used_at = now() WHERE id = $1`, [k.id]);
  return { keyId: k.id, ownerId: k.owner_id, environment: k.environment, scopes: k.scopes };
}

async function logCall(req: NextRequest, ctx: ApiContext | null, status: number, ms: number) {
  try {
    await pool!.query(
      `INSERT INTO api_logs (api_key_id, method, endpoint, status, duration_ms, ip)
       VALUES ($1,$2,$3,$4,$5,$6)`,
      [
        ctx?.keyId ?? null,
        req.method,
        new URL(req.url).pathname,
        status,
        Math.round(ms),
        req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
      ]
    );
  } catch {
    /* le log ne doit jamais casser la réponse */
  }
}

/** Enveloppe une route /api/v1 : auth + journal + gestion d'erreurs. */
export function apiRoute(handler: (req: NextRequest, ctx: ApiContext) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    const start = performance.now();
    let status = 500;
    let ctx: ApiContext | null = null;
    try {
      if (!hasDatabase) {
        status = 503;
        return jsonError(503, "service_indisponible", "La base de données n'est pas configurée.");
      }
      ctx = await authenticate(req);
      if (!ctx) {
        status = 401;
        return jsonError(401, "non_autorise", "Clé API manquante ou invalide. En-tête attendu : Authorization: Bearer <clé>.");
      }
      const res = await handler(req, ctx);
      status = res.status;
      return res;
    } catch (e) {
      status = 500;
      return jsonError(500, "erreur_interne", e instanceof Error ? e.message : "Erreur interne");
    } finally {
      logCall(req, ctx, status, performance.now() - start);
    }
  };
}

/** Génère un code de réunion lisible (ex. ngs-8f3k2a). */
export function genererCode(): string {
  return "ngs-" + crypto.randomBytes(4).toString("hex");
}
