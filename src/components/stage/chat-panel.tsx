"use client";

import { useState } from "react";
import { X, Smile, Send } from "lucide-react";
import { Avatar } from "@/components/avatar";

export type ChatMessage = {
  id: string;
  author: string;
  avatarUrl?: string | null;
  time: string;
  text: string;
  private?: boolean;
};

/** Panneau Chat de la reunion : onglets Tout le monde / Prive, fil, saisie. */
export function ChatPanel({
  messages,
  onClose,
  onSend,
  className = "",
}: {
  messages: ChatMessage[];
  onClose?: () => void;
  onSend?: (text: string) => void;
  className?: string;
}) {
  const [scope, setScope] = useState<"tous" | "prive">("tous");
  const [draft, setDraft] = useState("");

  const shown = messages.filter((m) =>
    scope === "prive" ? m.private : !m.private,
  );

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    onSend?.(text);
    setDraft("");
  };

  return (
    <aside
      className={`flex min-h-0 flex-col border-l border-hairline bg-surface ${className}`}
    >
      <header className="flex items-center justify-between px-4 pt-3.5 pb-2">
        <h2 className="text-[14px] font-semibold text-ink">Chat</h2>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer le chat"
            className="grid size-6 place-items-center rounded text-ink-soft hover:bg-canvas hover:text-ink"
          >
            <X size={15} />
          </button>
        )}
      </header>

      <div className="mx-4 flex rounded-lg bg-canvas p-0.5" role="tablist">
        {(
          [
            { key: "tous", label: "Tout le monde" },
            { key: "prive", label: "Privé" },
          ] as const
        ).map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={scope === t.key}
            onClick={() => setScope(t.key)}
            className={`flex-1 rounded-md py-1.5 text-[11.5px] font-semibold transition-colors ${
              scope === t.key
                ? "bg-surface text-primary shadow-sm"
                : "text-ink-soft hover:text-ink"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <ul className="scroll-clean min-h-0 flex-1 space-y-3.5 overflow-y-auto px-4 py-3.5">
        {shown.length === 0 && (
          <li className="pt-6 text-center text-[12px] text-ink-soft">
            Aucun message pour l&apos;instant.
          </li>
        )}
        {shown.map((m) => (
          <li key={m.id} className="flex gap-2.5">
            <Avatar name={m.author} src={m.avatarUrl} size={26} />
            <div className="min-w-0 flex-1">
              <p className="flex items-baseline gap-1.5">
                <span className="text-[12px] font-semibold text-ink">
                  {m.author}
                </span>
                <time className="text-[10.5px] text-ink-soft">{m.time}</time>
              </p>
              <p className="mt-0.5 text-[12px] leading-snug text-ink">
                {m.text}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <form onSubmit={submit} className="flex items-center gap-2 p-3">
        <div className="relative flex-1">
          <label htmlFor="chat-draft" className="sr-only">
            Écrire un message
          </label>
          <input
            id="chat-draft"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Écrire un message..."
            className="h-9 w-full rounded-lg border border-hairline bg-surface pr-8 pl-3 text-[12px] text-ink outline-none placeholder:text-ink-soft focus:border-primary focus:ring-2 focus:ring-primary/15"
          />
          <Smile
            size={14}
            className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-ink-soft"
          />
        </div>
        <button
          type="submit"
          aria-label="Envoyer"
          className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary text-white transition-colors hover:bg-primary-hover disabled:opacity-40"
          disabled={!draft.trim()}
        >
          <Send size={15} />
        </button>
      </form>
    </aside>
  );
}
