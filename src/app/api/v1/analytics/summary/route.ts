import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { apiRoute, type ApiContext } from "@/lib/api-auth";

export const dynamic = "force-dynamic";

/** GET /api/v1/analytics/summary — indicateurs clés du compte. */
export const GET = apiRoute(async (_req: NextRequest, ctx: ApiContext) => {
  const r = await pool!.query(
    `SELECT
      (SELECT COUNT(*) FROM meetings WHERE $1::uuid IS NULL OR host_id = $1) AS meetings_total,
      (SELECT COUNT(*) FROM meetings WHERE (host_id = $1 OR $1 IS NULL) AND kind = 'webinar') AS webinars_total,
      (SELECT COUNT(*) FROM meetings WHERE (host_id = $1 OR $1 IS NULL) AND status = 'live') AS meetings_live,
      (SELECT COUNT(*) FROM recordings WHERE $1::uuid IS NULL OR owner_id = $1) AS recordings_total,
      (SELECT COALESCE(SUM(duration_s),0) FROM recordings WHERE $1::uuid IS NULL OR owner_id = $1) AS recorded_seconds`,
    [ctx.ownerId]
  );
  return NextResponse.json({ data: r.rows[0] });
});
