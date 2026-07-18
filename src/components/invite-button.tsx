"use client";

import { useEffect, useState } from "react";
import { UserPlus, X, Copy, Check, Mail, MessageCircle } from "lucide-react";

/**
 * Bouton "Inviter" reellement fonctionnel : ouvre une modale avec un lien de
 * reunion partageable (copier, e-mail, WhatsApp). Le lien pointe vers une salle
 * instantanee que l'invite peut rejoindre directement.
 */
export function InviteButton() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [link, setLink] = useState("");

  // Genere un lien de salle unique a l'ouverture de la modale.
  useEffect(() => {
    if (open && !link) {
      const code = `reunion-${Math.random().toString(36).slice(2, 8)}`;
      setLink(`${window.location.origin}/reunion/${code}`);
    }
  }, [open, link]);

  // Ferme avec la touche Echap.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const message = `Rejoignez ma réunion NextGen Sync : ${link}`;

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
            className="w-full max-w-[440px] rounded-2xl bg-surface p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-[16px] font-bold text-ink">Inviter à une réunion</h2>
                <p className="mt-1 text-[12.5px] text-ink-soft">
                  Partagez ce lien : vos invités rejoignent en un clic.
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

            <div className="mt-5 flex items-center gap-2 rounded-lg border border-hairline bg-canvas px-3 py-2.5">
              <span className="min-w-0 flex-1 truncate text-[12.5px] text-ink">
                {link}
              </span>
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

            <div className="mt-3 grid grid-cols-2 gap-2.5">
              <a
                href={`mailto:?subject=${encodeURIComponent("Invitation à une réunion NextGen Sync")}&body=${encodeURIComponent(message)}`}
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
