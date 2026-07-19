"use client";

import { Mic, MicOff, Hand, MoreVertical, Crown, UserMinus, X, Search } from "lucide-react";
import { useState } from "react";
import { Avatar } from "@/components/avatar";

export type RoomParticipant = {
  id: string;
  name: string;
  avatarUrl?: string | null;
  muted: boolean;
  camOff?: boolean;
  handRaised?: boolean;
  isHost?: boolean;
  isCoHost?: boolean;
  isSelf?: boolean;
};

/** Panneau Participants façon Zoom : recherche, actions d'hôte, « Tout couper ». */
export function HostParticipantsPanel({
  participants,
  isHost,
  onToggleMute,
  onLowerHand,
  onMakeCoHost,
  onRemove,
  onMuteAll,
  onClose,
}: {
  participants: RoomParticipant[];
  isHost: boolean;
  onToggleMute: (id: string) => void;
  onLowerHand: (id: string) => void;
  onMakeCoHost: (id: string) => void;
  onRemove: (id: string) => void;
  onMuteAll: () => void;
  onClose: () => void;
}) {
  const [q, setQ] = useState("");
  const [menu, setMenu] = useState<string | null>(null);
  const raised = participants.filter((p) => p.handRaised);
  const list = participants.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <aside className="flex w-[280px] shrink-0 flex-col border-l border-hairline bg-white">
      <header className="flex items-center justify-between px-4 py-3">
        <h2 className="text-[13.5px] font-semibold text-ink">
          Participants ({participants.length})
        </h2>
        <button type="button" onClick={onClose} aria-label="Fermer" className="text-ink-soft hover:text-ink">
          <X size={16} />
        </button>
      </header>

      <div className="px-3">
        <div className="flex items-center gap-2 rounded-lg border border-hairline px-2.5 py-1.5">
          <Search size={14} className="text-ink-soft" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Rechercher un participant"
            className="w-full bg-transparent text-[12.5px] outline-none placeholder:text-ink-soft"
          />
        </div>
      </div>

      {raised.length > 0 && (
        <div className="mt-2 px-4 text-[11px] font-medium text-accent-orange">
          ✋ {raised.length} main{raised.length > 1 ? "s" : ""} levée{raised.length > 1 ? "s" : ""}
        </div>
      )}

      <ul className="scroll-clean mt-2 min-h-0 flex-1 overflow-y-auto px-2">
        {list.map((p) => (
          <li key={p.id} className="relative">
            <div className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-canvas">
              <Avatar name={p.name} src={p.avatarUrl} size={30} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="truncate text-[12.5px] font-medium text-ink">{p.name}</span>
                  {p.isHost && <span className="rounded bg-primary-soft px-1 text-[9px] font-semibold text-primary">Hôte</span>}
                  {p.isCoHost && <span className="rounded bg-accent-violet/15 px-1 text-[9px] font-semibold text-accent-violet">Co-hôte</span>}
                </div>
              </div>
              {p.handRaised && <Hand size={14} className="text-accent-orange" />}
              <span className={p.muted ? "text-danger" : "text-accent-green"}>
                {p.muted ? <MicOff size={14} /> : <Mic size={14} />}
              </span>
              {isHost && !p.isSelf && (
                <button
                  type="button"
                  onClick={() => setMenu(menu === p.id ? null : p.id)}
                  aria-label="Actions"
                  className="text-ink-soft hover:text-ink"
                >
                  <MoreVertical size={15} />
                </button>
              )}
            </div>

            {menu === p.id && (
              <div className="absolute right-2 top-9 z-20 w-44 overflow-hidden rounded-lg border border-hairline bg-white py-1 shadow-lg">
                <MenuItem icon={p.muted ? Mic : MicOff} label={p.muted ? "Réactiver le micro" : "Couper le micro"}
                  onClick={() => { onToggleMute(p.id); setMenu(null); }} />
                {p.handRaised && (
                  <MenuItem icon={Hand} label="Baisser la main" onClick={() => { onLowerHand(p.id); setMenu(null); }} />
                )}
                {!p.isCoHost && (
                  <MenuItem icon={Crown} label="Nommer co-hôte" onClick={() => { onMakeCoHost(p.id); setMenu(null); }} />
                )}
                <MenuItem icon={UserMinus} label="Retirer" danger onClick={() => { onRemove(p.id); setMenu(null); }} />
              </div>
            )}
          </li>
        ))}
      </ul>

      {isHost && (
        <div className="border-t border-hairline p-3">
          <button
            type="button"
            onClick={onMuteAll}
            className="w-full rounded-lg border border-hairline py-2 text-[12.5px] font-semibold text-ink hover:bg-canvas"
          >
            Couper le micro de tous
          </button>
        </div>
      )}
    </aside>
  );
}

function MenuItem({
  icon: Icon,
  label,
  onClick,
  danger,
}: {
  icon: typeof Mic;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-2 px-3 py-1.5 text-left text-[12.5px] hover:bg-canvas ${
        danger ? "text-danger" : "text-ink"
      }`}
    >
      <Icon size={14} />
      {label}
    </button>
  );
}
