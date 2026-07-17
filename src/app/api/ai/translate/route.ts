import { NextResponse } from "next/server";
import { translate } from "@/lib/ai";

/**
 * Traduction d'un segment (sous-titres live / chat).
 * POST /api/ai/translate  { text: string, targetLang: string }
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const text = body?.text;
  const targetLang = body?.targetLang;

  if (typeof text !== "string" || typeof targetLang !== "string") {
    return NextResponse.json(
      { error: "text et targetLang requis" },
      { status: 400 },
    );
  }

  const translated = await translate(text, targetLang);
  return NextResponse.json({ translated });
}
