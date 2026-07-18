import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { apiRoute, type ApiContext } from "@/lib/api-auth";

export const dynamic = "force-dynamic";

/** GET /api/v1/recordings — enregistrements + compte rendu IA (décisions, tâches). */
export const GET = apiRoute(async (req: NextRequest, ctx: ApiContext) => {
  const limit = Math.min(Number(new URL(req.url).searchParams.get("limit") ?? 20), 100);
  const rows = await pool!.query(
    `SELECT r.id, r.title, r.url, r.duration_s, r.recorded_at,
            r.summary, r.decisions, r.action_items,
            m.code AS meeting_code, m.title AS meeting_title
     FROM recordings r
     LEFT JOIN meetings m ON m.id = r.meeting_id
     WHERE ($1::uuid IS NULL OR r.owner_id = $1)
     ORDER BY r.recorded_at DESC LIMIT $2`,
    [ctx.ownerId, limit]
  );
  return NextResponse.json({ data: rows.rows, total: rows.rows.length });
});
