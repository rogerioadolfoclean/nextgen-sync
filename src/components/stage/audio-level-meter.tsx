"use client";

export function AudioLevelMeter({ level, compact = false }: { level: number; compact?: boolean }) {
  const percent = Math.round(Math.max(0, Math.min(1, level)) * 100);
  const color = percent >= 82 ? "bg-danger" : percent >= 58 ? "bg-amber-400" : "bg-accent-green";

  return (
    <div className={compact ? "w-14" : "w-full"} role="meter" aria-label="Niveau du microphone" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}>
      <div className="h-1.5 overflow-hidden rounded-full bg-white/15">
        <div className={`h-full rounded-full transition-[width] duration-75 ${color}`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
