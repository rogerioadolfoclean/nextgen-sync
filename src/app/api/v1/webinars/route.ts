import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { apiRoute, type ApiContext } from "@/lib/api-auth";

export const dynamic = "force-dynamic";

const BASE = process.env.APP_BASE_URL ?? "https://nextgen-sync-devaryx-kernel.vercel.app";

/** GET /api/v1/webinars — réunions de type webinaire + nb d'inscrits. */
export const GET = apiRoute(async (req: NextRequest, ctx: ApiContext) => {
  const limit = Math.min(Number(new URL(req.url).searchParams.get("limit") ?? 20), 100);
  const rows = await pool!.query(
    `SELECT m.id, m.code, m.title, m.status, m.scheduled_at, m.created_at,
            (SELECT COUNT(*) FROM participants p WHERE p.meeting_id = m.id) AS registrants
     FROM meetings m
     WHERE m.kind = 'webinar' AND ($1::uuid IS NULL OR m.host_id = $1)
     ORDER BY m.scheduled_at NULLS LAST, m.created_at DESC LIMIT $2`,
    [ctx.ownerId, limit]
  );
  const data = rows.rows.map((w) => ({ ...w, join_url: `${BASE}/reunion/${w.code}` }));
  return NextResponse.json({ data, total: data.length });
});
