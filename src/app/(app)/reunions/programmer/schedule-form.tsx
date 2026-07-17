"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Calendar, Check, Copy } from "lucide-react";

function toCode(title: string) {
  const base = title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${base || "reunion"}-${Math.random().toString(36).slice(2, 6)}`;
}

export function ScheduleForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [scheduled, setScheduled] = useState<{ code: string } | null>(null);
  const [copied, setCopied] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    // En mode demo, on genere le lien de la salle. Avec la base, cette action
    // inserera aussi la ligne `meetings` (scheduled_at).
    setScheduled({ code: toCode(title) });
  }

  const link = scheduled
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/reunion/${scheduled.code}`
    : "";

  if (scheduled) {
    return (
      <div className="rounded-card border border-hairline bg-surface p-6 text-center">
        <span className="mx-auto grid size-11 place-items-center rounded-full bg-accent-green/15 text-accent-green">
          <Check size={22} />
        </span>
        <h2 className="mt-3 text-[16px] font-bold text-ink">Réunion programmée</h2>
        <p className="mt-1 text-[13px] text-ink-soft">
          « {title} »{date && time ? ` — le ${date} à ${time}` : ""}
        </p>

        <div className="mt-5 flex items-center gap-2 rounded-lg border border-hairline bg-canvas px-3 py-2.5 text-left">
          <span className="min-w-0 flex-1 truncate text-[12.5px] text-ink">{link}</span>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard?.writeText(link);
              setCopied(true);
            }}
            className="flex shrink-0 items-center gap-1 rounded-md bg-primary px-2.5 py-1.5 text-[11.5px] font-semibold text-white hover:bg-primary-hover"
          >
            <Copy size={13} /> {copied ? "Copié" : "Copier"}
          </button>
        </div>

        <div className="mt-5 flex justify-center gap-2.5">
          <button
            type="button"
            onClick={() => router.push(`/reunion/${scheduled.code}`)}
            className="h-10 rounded-lg bg-primary px-4 text-[12.5px] font-semibold text-white hover:bg-primary-hover"
          >
            Démarrer maintenant
          </button>
          <button
            type="button"
            onClick={() => router.push("/reunions")}
            className="h-10 rounded-lg border border-hairline bg-surface px-4 text-[12.5px] font-semibold text-ink hover:bg-canvas"
          >
            Retour aux réunions
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-card border border-hairline bg-surface p-5">
      <label htmlFor="title" className="text-[12.5px] font-semibold text-ink">
        Titre de la réunion
      </label>
      <input
        id="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="ex. Revue produit"
        autoFocus
        className="mt-2 h-11 w-full rounded-lg border border-hairline bg-surface px-3.5 text-[14px] text-ink outline-none placeholder:text-ink-soft focus:border-primary focus:ring-2 focus:ring-primary/15"
      />

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="date" className="text-[12.5px] font-semibold text-ink">
            Date
          </label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-2 h-11 w-full rounded-lg border border-hairline bg-surface px-3 text-[13px] text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
          />
        </div>
        <div>
          <label htmlFor="time" className="text-[12.5px] font-semibold text-ink">
            Heure
          </label>
          <input
            id="time"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="mt-2 h-11 w-full rounded-lg border border-hairline bg-surface px-3 text-[13px] text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={!title.trim()}
        className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary text-[13.5px] font-semibold text-white transition-colors hover:bg-primary-hover disabled:opacity-40"
      >
        <Calendar size={16} /> Programmer la réunion
      </button>
    </form>
  );
}
