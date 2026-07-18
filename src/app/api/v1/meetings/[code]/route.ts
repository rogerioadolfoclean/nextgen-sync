import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { apiRoute, jsonError, type ApiContext } from "@/lib/api-auth";

export const dynamic = "force-dynamic";

const BASE = process.env.APP_BASE_URL ?? "https://nextgen-sync-devaryx-kernel.vercel.app";

/** GET /api/v1/meetings/{code} — détail d'une réunion + participants. */
export const GET = apiRoute(async (req: NextRequest, ctx: ApiContext) => {
  const code = new URL(req.url).pathname.split("/").pop();
  const m = await pool!.query(
    `SELECT id, code, title, kind, status, scheduled_at, started_at, ended_at, waiting_room, created_at
     FROM meetings WHERE code = $1`,
    [code]
  );
  if (!m.rows[0]) return jsonError(404, "introuvable", `Aucune réunion avec le code ${code}.`);
  const meeting = m.rows[0];

  const parts = await pool!.query(
    `SELECT display_name, role, muted, admitted, joined_at, left_at
     FROM participants WHERE meeting_id = $1 ORDER BY joined_at NULLS LAST`,
    [meeting.id]
  );
  return NextResponse.json({
    data: { ...meeting, join_url: `${BASE}/reunion/${meeting.code}`, participants: parts.rows },
  });
});
