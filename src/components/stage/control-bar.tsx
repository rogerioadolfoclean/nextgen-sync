"use client";

import { PhoneOff, type LucideIcon } from "lucide-react";

export type ControlTone = "default" | "active" | "off";

export type Control = {
  key: string;
  icon: LucideIcon;
  label: string;
  /** "active" = pastille verte (partage en cours), "off" = coupe (micro/camera). */
  tone?: ControlTone;
  badge?: number;
  onClick?: () => void;
};

/**
 * Bouton de la barre de reunion : glyphe dans une tuile, libelle dessous.
 * Le mockup met "Partager" en vert quand le partage est actif.
 */
export function ControlButton({
  icon: Icon,
  label,
  tone = "default",
  badge,
  onClick,
  compact = false,
}: Omit<Control, "key"> & { compact?: boolean }) {
  const tile =
    tone === "active"
      ? "bg-accent-green text-white"
      : tone === "off"
        ? "bg-danger text-white"
        : "text-white group-hover:bg-white/10";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={tone !== "default"}
      className="group flex flex-col items-center gap-1 outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-stage"
    >
      <span
        className={`relative grid place-items-center rounded-lg transition-colors ${tile} ${
          compact ? "size-8" : "size-9"
        }`}
      >
        <Icon size={compact ? 17 : 19} />
        {badge !== undefined && badge > 0 && (
          <span className="absolute -top-1 -right-1.5 grid min-w-[15px] place-items-center rounded-full bg-danger px-1 text-[9px] leading-[15px] font-bold text-white">
            {badge}
          </span>
        )}
      </span>
      <span
        className={`font-medium text-white/85 ${compact ? "text-[9px]" : "text-[10.5px]"}`}
      >
        {label}
      </span>
    </button>
  );
}

/** Bouton rond rouge "raccrocher". */
export function HangUpButton({
  onClick,
  size = 44,
  label = "Quitter la réunion",
}: {
  onClick?: () => void;
  size?: number;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      style={{ width: size, height: size }}
      className="grid shrink-0 place-items-center rounded-full bg-danger text-white transition-colors hover:bg-danger-hover focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none"
    >
      <PhoneOff size={size * 0.4} />
    </button>
  );
}

/** Barre sombre du bas d'une reunion. */
export function ControlBar({
  controls,
  onHangUp,
  compact = false,
  className = "",
}: {
  controls: Control[];
  onHangUp?: () => void;
  compact?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center justify-center gap-6 bg-stage px-4 py-2.5 sm:gap-9 ${className}`}
    >
      {controls.map(({ key, ...control }) => (
        <ControlButton key={key} {...control} compact={compact} />
      ))}
      {onHangUp && <HangUpButton onClick={onHangUp} />}
    </div>
  );
}
