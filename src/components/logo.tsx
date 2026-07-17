import { Video } from "lucide-react";

/** Marque NextGen Sync : carre bleu arrondi + glyphe video, comme dans le mockup. */
export function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <span
      className="grid shrink-0 place-items-center rounded-lg bg-primary text-white"
      style={{ width: size, height: size }}
    >
      <Video size={size * 0.55} strokeWidth={2.4} />
    </span>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <LogoMark />
      <span className="text-[15px] font-semibold tracking-tight text-white">
        NextGen Sync
      </span>
    </span>
  );
}
