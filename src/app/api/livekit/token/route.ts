import { NextResponse } from "next/server";
import {
  hasLiveKit,
  createAccessToken,
  ensureRoom,
  publicUrl,
} from "@/lib/livekit";
import { getSessionUser } from "@/lib/session";

/**
 * Delivre un jeton d'acces LiveKit pour une salle donnee.
 * GET /api/livekit/token?room=<code>&role=host|attendee
 *
 * En l'absence de cles, renvoie { enabled: false } : la salle bascule alors
 * en mode demo cote client, sans erreur.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const room = searchParams.get("room");
  const role = searchParams.get("role") ?? "attendee";

  if (!room) {
    return NextResponse.json({ error: "room requis" }, { status: 400 });
  }

  if (!hasLiveKit) {
    return NextResponse.json({ enabled: false });
  }

  const user = await getSessionUser();
  await ensureRoom(room);

  const token = await createAccessToken({
    room,
    identity: user.id,
    name: user.name,
    canPublish: role === "host" || role === "moderator" || role === "speaker",
  });

  return NextResponse.json({
    enabled: true,
    token,
    url: publicUrl(),
    identity: user.id,
  });
}
