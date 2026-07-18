import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { apiRoute, jsonError, genererCode, type ApiContext } from "@/lib/api-auth";

export const dynamic = "force-dynamic";

const BASE = process.env.APP_BASE_URL ?? "https://nextgen-sync-devaryx-kernel.vercel.app";

/** GET /api/v1/meetings — liste les réunions du compte. */
export const GET = apiRoute(async (req: NextRequest, ctx: ApiContext) => {
  const url = new URL(req.url);
  const kind = url.searchParams.get("kind"); // meeting | webinar
  const limit = Math.min(Number(url.searchParams.get("limit") ?? 20), 100);
  const rows = await pool!.query(
    `SELECT id, code, title, kind, status, scheduled_at, started_at, ended_at, created_at
     FROM meetings
     WHERE ($1::uuid IS NULL OR host_id = $1) AND ($2::text IS NULL OR kind = $2)
     ORDER BY created_at DESC LIMIT $3`,
    [ctx.ownerId, kind, limit]
  );
  const data = rows.rows.map((m) => ({ ...m, join_url: `${BASE}/reunion/${m.code}` }));
  return NextResponse.json({ data, total: data.length });
});

/** POST /api/v1/meetings — crée une réunion et renvoie le lien d'accès. */
export const POST = apiRoute(async (req: NextRequest, ctx: ApiContext) => {
  let body: { title?: string; kind?: string; scheduled_at?: string; waiting_room?: boolean };
  try {
    body = await req.json();
  } catch {
    return jsonError(400, "json_invalide", "Le corps de la requête doit être du JSON valide.");
  }
  const { title, kind = "meeting", scheduled_at = null, waiting_room = false } = body;
  if (!title) return jsonError(422, "parametres_manquants", "Le champ 'title' est obligatoire.");
  if (!["meeting", "webinar"].includes(kind))
    return jsonError(422, "kind_invalide", "kind doit valoir 'meeting' ou 'webinar'.");

  const code = genererCode();
  const status = scheduled_at ? "scheduled" : "live";
  const rows = await pool!.query(
    `INSERT INTO meetings (code, title, host_id, kind, status, scheduled_at, started_at, waiting_room)
     VALUES ($1,$2,$3,$4,$5,$6, CASE WHEN $6 IS NULL THEN now() ELSE NULL END, $7)
     RETURNING id, code, title, kind, status, scheduled_at, created_at`,
    [code, title, ctx.ownerId, kind, status, scheduled_at, waiting_room]
  );
  const m = rows.rows[0];
  return NextResponse.json({ data: { ...m, join_url: `${BASE}/reunion/${m.code}` } }, { status: 201 });
});
