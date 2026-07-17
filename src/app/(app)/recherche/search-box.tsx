"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search, Video, Radio, CirclePlay, type LucideIcon } from "lucide-react";

type Item = { icon: LucideIcon; label: string; href: string; kind: string };

/** Index de recherche cote client (mode demo). */
const INDEX: Item[] = [
  { icon: Video, label: "Réunion d'équipe", href: "/reunion/equipe-hebdo", kind: "Réunion" },
  { icon: Video, label: "Point marketing", href: "/reunion/point-marketing", kind: "Réunion" },
  { icon: Video, label: "Revue produit", href: "/reunion/revue-produit", kind: "Réunion" },
  { icon: Video, label: "Brainstorming produit", href: "/reunion/brainstorming-produit", kind: "Réunion" },
  { icon: Radio, label: "Webinaire : L'avenir du travail", href: "/webinaire/avenir-du-travail", kind: "Webinaire" },
  { icon: CirclePlay, label: "Présentation Q1", href: "/enregistrements/r1", kind: "Enregistrement" },
  { icon: CirclePlay, label: "Formation produit", href: "/enregistrements/r2", kind: "Enregistrement" },
  { icon: CirclePlay, label: "Webinaire : IA & Collaboration", href: "/enregistrements/r3", kind: "Enregistrement" },
];

export function SearchBox() {
  const [q, setQ] = useState("");

  const results = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return [];
    return INDEX.filter((i) => i.label.toLowerCase().includes(t));
  }, [q]);

  return (
    <div>
      <div className="relative">
        <Search
          size={16}
          className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-ink-soft"
        />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          autoFocus
          placeholder="Rechercher une réunion, un webinaire, un enregistrement…"
          className="h-12 w-full rounded-xl border border-hairline bg-surface pr-4 pl-11 text-[14px] text-ink outline-none placeholder:text-ink-soft focus:border-primary focus:ring-2 focus:ring-primary/15"
        />
      </div>

      {q.trim() && (
        <ul className="mt-4 overflow-hidden rounded-card border border-hairline bg-surface">
          {results.length === 0 ? (
            <li className="px-4 py-6 text-center text-[13px] text-ink-soft">
              Aucun résultat pour « {q} ».
            </li>
          ) : (
            results.map((r) => (
              <li key={r.href} className="border-b border-hairline last:border-0">
                <Link
                  href={r.href}
                  className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-canvas"
                >
                  <span className="grid size-8 place-items-center rounded-lg bg-canvas text-ink-soft">
                    <r.icon size={15} />
                  </span>
                  <span className="min-w-0 flex-1 truncate text-[13.5px] font-medium text-ink">
                    {r.label}
                  </span>
                  <span className="shrink-0 text-[11px] text-ink-soft">{r.kind}</span>
                </Link>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
