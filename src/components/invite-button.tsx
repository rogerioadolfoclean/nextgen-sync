"use client";

import { useEffect, useMemo, useState } from "react";
import { UserPlus, X, Copy, Check, Mail, MessageCircle, CalendarClock } from "lucide-react";

/** Slug du titre pour l'URL de la salle. */
function slug(title: string) {
  return title
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

/** "vendredi 25 juillet 2026 à 14:00" a partir de la date + l'heure saisies. */
function formatWhen(date: string, time: string): string {
  if (!date) return "";
  const d = new Date(`${date}T${time || "00:00"}`);
  if (Number.isNaN(d.getTime())) return "";
  const day = d.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return time ? `${day} à ${time}` : day;
}

/**
 * Bouton "Inviter" : l'utilisateur saisit le titre de sa reunion, le jour et
 * l'heure, puis partage le lien (copier, e-mail, WhatsApp). Le message d'invitation
 * reprend le titre et la date/heure.
 */
export function InviteButton() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [suffix, setSuffix] = useState("");

  // Suffixe aleatoire fixe par ouverture (le code reste stable pendant la saisie).
  useEffect(() => {
    if (open && !suffix) setSuffix(Math.random().toString(36).slice(2, 6));
  }, [open, suffix]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const code = `${slug(title) || "reunion"}-${suffix}`;
  const link = useMemo(
    () => (typeof window !== "undefined" ? `${window.location.origin}/reunion/${code}` : ""),
    [code],
  );
  const whenText = formatWhen(date, time);

  const message = [
    `Invitation à ma réunion NextGen Sync${title ? " : " + title : ""}.`,
    whenText ? `Quand : ${whenText}.` : "",
    `Rejoignez ici : ${link}`,
  ]
    .filter(Boolean)
    .join("\n");

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-8 items-center gap-1.5 rounded-lg bg-primary px-3.5 text-[12.5px] font-semibold text-white transition-colors hover:bg-primary-hover"
      >
        <UserPlus size={14} />
        Inviter
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Inviter à une réunion"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[460px] rounded-2xl bg-surface p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-[16px] font-bold text-ink">Inviter à une réunion</h2>
                <p className="mt-1 text-[12.5px] text-ink-soft">
                  Donnez un titre, une date et une heure, puis partagez le lien.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Fermer"
                className="grid size-7 place-items-center rounded-lg text-ink-soft hover:bg-canvas hover:text-ink"
              >
                <X size={16} />
              </button>
            </div>

            {/* Titre */}
            <label htmlFor="inv-title" className="mt-5 block text-[12px] font-semibold text-ink">
              Titre de la réunion
            </label>
            <input
              id="inv-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="ex. Réunion d'équipe"
              autoFocus
              className="mt-1.5 h-10 w-full rounded-lg border border-hairline bg-surface px-3 text-[13.5px] text-ink outline-none placeholder:text-ink-soft focus:border-primary focus:ring-2 focus:ring-primary/15"
            />

            {/* Date + heure */}
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="inv-date" className="block text-[12px] font-semibold text-ink">
                  Jour / date / mois
                </label>
                <input
                  id="inv-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-1.5 h-10 w-full rounded-lg border border-hairline bg-surface px-2.5 text-[13px] text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                />
              </div>
              <div>
                <label htmlFor="inv-time" className="block text-[12px] font-semibold text-ink">
                  Heure
                </label>
                <input
                  id="inv-time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="mt-1.5 h-10 w-full rounded-lg border border-hairline bg-surface px-2.5 text-[13px] text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                />
              </div>
            </div>

            {/* Recap date/heure */}
            {whenText && (
              <p className="mt-3 flex items-center gap-1.5 rounded-lg bg-primary-soft px-3 py-2 text-[12px] font-medium text-primary">
                <CalendarClock size={14} /> {whenText}
              </p>
            )}

            {/* Lien */}
            <div className="mt-4 flex items-center gap-2 rounded-lg border border-hairline bg-canvas px-3 py-2.5">
              <span className="min-w-0 flex-1 truncate text-[12.5px] text-ink">{link}</span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(link);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="flex shrink-0 items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-[11.5px] font-semibold text-white hover:bg-primary-hover"
              >
                {copied ? <Check size={13} /> : <Copy size={13} />}
                {copied ? "Copié" : "Copier"}
              </button>
            </div>

            {/* Partage */}
            <div className="mt-3 grid grid-cols-2 gap-2.5">
              <a
                href={`mailto:?subject=${encodeURIComponent(
                  `Invitation${title ? " : " + title : " à une réunion NextGen Sync"}`,
                )}&body=${encodeURIComponent(message)}`}
                className="flex h-10 items-center justify-center gap-2 rounded-lg border border-hairline bg-surface text-[12.5px] font-semibold text-ink hover:bg-canvas"
              >
                <Mail size={15} /> E-mail
              </a>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(message)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 items-center justify-center gap-2 rounded-lg border border-hairline bg-surface text-[12.5px] font-semibold text-ink hover:bg-canvas"
              >
                <MessageCircle size={15} /> WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
