"use client";

import { useState } from "react";
import { Mic, MicOff, MonitorUp } from "lucide-react";
import { Avatar } from "@/components/avatar";

export type PanelParticipant = {
  id: string;
  name: string;
  avatarUrl?: string | null;
  muted: boolean;
  isHost?: boolean;
  isSelf?: boolean;
  isSpeaker?: boolean;
  isModerator?: boolean;
  sharing?: boolean;
};

type Filter = "tous" | "intervenants" | "moderateurs";

/** Panneau "Participants (n)" : onglets de filtre + liste + lien "Voir tous". */
export function ParticipantsPanel({
  total,
  participants,
}: {
  total: number;
  participants: PanelParticipant[];
}) {
  const [filter, setFilter] = useState<Filter>("tous");
  const [expanded, setExpanded] = useState(false);

  const speakers = participants.filter((p) => p.isSpeaker);
  const moderators = participants.filter((p) => p.isModerator);

  const tabs: { key: Filter; label: string }[] = [
    { key: "tous", label: "Tous" },
    { key: "intervenants", label: `Intervenants (${speakers.length})` },
    { key: "moderateurs", label: `Modérateurs (${moderators.length})` },
  ];

  const filtered =
    filter === "intervenants"
      ? speakers
      : filter === "moderateurs"
        ? moderators
        : participants;

  const visible = expanded ? filtered : filtered.slice(0, 5);

  return (
    <section className="flex min-h-0 flex-col p-4">
      <h2 className="text-[13.5px] font-semibold text-ink">
        Participants ({total.toLocaleString("fr-FR")})
      </h2>

      <div className="mt-3 flex gap-1.5" role="tablist">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={filter === t.key}
            onClick={() => setFilter(t.key)}
            className={`rounded-lg border px-2.5 py-1.5 text-[11px] font-medium whitespace-nowrap transition-colors ${
              filter === t.key
                ? "border-primary/30 bg-primary-soft text-primary"
                : "border-hairline bg-surface text-ink hover:bg-canvas"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <ul className="scroll-clean mt-3 min-h-0 flex-1 space-y-0.5 overflow-y-auto">
        {visible.map((p) => (
          <li key={p.id} className="flex items-center gap-2.5 rounded-lg py-1.5">
            <Avatar name={p.name} src={p.avatarUrl} size={26} />
            <span className="min-w-0 flex-1 truncate text-[12.5px] text-ink">
              {p.name}
              {(p.isHost || p.isSelf) && (
                <span className="text-ink-soft">
                  {" "}
                  ({[p.isHost && "Hôte", p.isSelf && "moi"]
                    .filter(Boolean)
                    .join(", ")}
                  )
                </span>
              )}
            </span>
            <span className="flex shrink-0 items-center gap-2">
              {p.sharing && <MonitorUp size={13} className="text-ink" />}
              {p.muted ? (
                <MicOff size={13} className="text-danger" />
              ) : (
                <Mic size={13} className="text-ink" />
              )}
            </span>
          </li>
        ))}
      </ul>

      {filtered.length > 5 && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-1 self-start text-[12px] font-semibold text-primary hover:underline"
        >
          {expanded ? "Réduire" : "Voir tous"}
        </button>
      )}
    </section>
  );
}
