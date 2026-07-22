import { NextResponse } from "next/server";
import { suggestMeetingActions } from "@/lib/ai";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const context = body?.context;
  if (typeof context !== "string" || context.trim().length === 0) {
    return NextResponse.json({ error: "contexte requis" }, { status: 400 });
  }
  try {
    return NextResponse.json(await suggestMeetingActions(context));
  } catch {
    return NextResponse.json({ error: "Analyse IA momentanément indisponible" }, { status: 503 });
  }
}
