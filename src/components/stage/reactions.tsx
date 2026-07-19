"use client";

import { useEffect, useState } from "react";

export const REACTIONS = ["👍", "❤️", "😂", "🎉", "👏", "😮", "🙌", "🔥"] as const;

type Flying = { id: number; emoji: string; left: number };

/** Barre de réactions Zoom : au clic, l'emoji s'envole depuis le bas de la scène. */
export function ReactionsBar({
  open,
  onClose,
  onReact,
}: {
  open: boolean;
  onClose: () => void;
  onReact: (emoji: string) => void;
}) {
  if (!open) return null;
  return (
    <div
      className="absolute bottom-2 left-1/2 z-30 -translate-x-1/2 rounded-full border border-white/10 bg-navy/95 px-2 py-1.5 shadow-lg backdrop-blur"
      role="menu"
    >
      <div className="flex items-center gap-0.5">
        {REACTIONS.map((e) => (
          <button
            key={e}
            type="button"
            onClick={() => {
              onReact(e);
              onClose();
            }}
            className="grid size-8 place-items-center rounded-full text-[18px] transition-transform hover:scale-125 hover:bg-white/10"
            aria-label={`Réagir ${e}`}
          >
            {e}
          </button>
        ))}
      </div>
    </div>
  );
}

/** Couche d'affichage des emojis qui montent à l'écran. */
export function FlyingReactions({ items }: { items: Flying[] }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      {items.map((f) => (
        <span
          key={f.id}
          className="absolute bottom-4 animate-[floatUp_2.6s_ease-out_forwards] text-[30px]"
          style={{ left: `${f.left}%` }}
        >
          {f.emoji}
        </span>
      ))}
    </div>
  );
}

/** Hook : gère la file des réactions volantes (auto-nettoyées). */
export function useFlyingReactions() {
  const [items, setItems] = useState<Flying[]>([]);

  const push = (emoji: string) => {
    const id = Date.now() + Math.random();
    setItems((prev) => [...prev, { id, emoji, left: 20 + Math.random() * 60 }]);
    setTimeout(() => setItems((prev) => prev.filter((i) => i.id !== id)), 2600);
  };

  useEffect(() => () => setItems([]), []);
  return { items, push };
}
