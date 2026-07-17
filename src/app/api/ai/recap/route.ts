import { NextResponse } from "next/server";
import { summarizeMeeting } from "@/lib/ai";

/**
 * Compte rendu automatique d'une reunion.
 * POST /api/ai/recap  { transcript: string }
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const transcript = body?.transcript;

  if (typeof transcript !== "string" || transcript.trim().length === 0) {
    return NextResponse.json({ error: "transcript requis" }, { status: 400 });
  }

  const recap = await summarizeMeeting(transcript);
  return NextResponse.json(recap);
}
