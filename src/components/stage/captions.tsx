"use client";

import { useEffect, useState } from "react";
import { Captions as CaptionsIcon, Languages } from "lucide-react";

const LANGS = [
  { code: "fr", label: "Français" },
  { code: "en", label: "English" },
  { code: "pt", label: "Português" },
  { code: "es", label: "Español" },
  { code: "ln", label: "Lingala" },
];

/** Phrases de demonstration, jouees en boucle tant que Deepgram n'est pas branche. */
const DEMO_LINES = [
  "Bienvenue à tous, commençons la réunion.",
  "Je partage mon écran pour la présentation.",
  "Excellente idée, ajoutons-la à la feuille de route.",
  "On valide la traduction en temps réel pour la prochaine version.",
];

/**
 * Bandeau de sous-titres IA en direct. Affiche la transcription (mode demo tant
 * que DEEPGRAM_API_KEY n'est pas configuree) et traduit chaque ligne via
 * /api/ai/translate quand une autre langue est choisie.
 */
export function LiveCaptions({ onClose }: { onClose?: () => void }) {
  const [lang, setLang] = useState("fr");
  const [line, setLine] = useState(DEMO_LINES[0]);
  const [shown, setShown] = useState(DEMO_LINES[0]);
  const [i, setI] = useState(0);

  // Fait defiler les phrases de demonstration.
  useEffect(() => {
    const id = setInterval(() => {
      setI((prev) => {
        const next = (prev + 1) % DEMO_LINES.length;
        setLine(DEMO_LINES[next]);
        return next;
      });
    }, 3500);
    return () => clearInterval(id);
  }, []);

  // Traduit la ligne courante quand la langue n'est pas le francais source.
  useEffect(() => {
    let cancelled = false;
    if (lang === "fr") {
      setShown(line);
      return;
    }
    (async () => {
      try {
        const res = await fetch("/api/ai/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: line, targetLang: lang }),
        });
        const data = await res.json();
        if (!cancelled) setShown(data.translated ?? line);
      } catch {
        if (!cancelled) setShown(line);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [line, lang]);

  return (
    <div className="pointer-events-auto flex items-center gap-3 rounded-xl bg-black/70 px-4 py-2.5 backdrop-blur-sm">
      <CaptionsIcon size={16} className="shrink-0 text-white/70" />
      <p className="min-w-0 flex-1 truncate text-[13px] font-medium text-white">
        {shown}
      </p>
      <label className="flex shrink-0 items-center gap-1.5 text-white/80">
        <Languages size={14} />
        <span className="sr-only">Langue des sous-titres</span>
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value)}
          className="rounded-md bg-white/10 px-1.5 py-0.5 text-[11px] text-white outline-none"
        >
          {LANGS.map((l) => (
            <option key={l.code} value={l.code} className="text-ink">
              {l.label}
            </option>
          ))}
        </select>
      </label>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 text-[11px] text-white/60 hover:text-white"
        >
          Masquer
        </button>
      )}
    </div>
  );
}
