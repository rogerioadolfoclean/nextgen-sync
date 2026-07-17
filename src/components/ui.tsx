import Link from "next/link";
import type { LucideIcon } from "lucide-react";

/** Carte blanche a bord fin, base de tous les blocs du dashboard. */
export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-card border border-hairline bg-surface ${className}`}
    >
      {children}
    </section>
  );
}

/** En-tete de carte : titre a gauche, action ("Voir tout", badge) a droite. */
export function CardHeader({
  title,
  action,
}: {
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <header className="flex items-center justify-between gap-3 px-4 py-3">
      <h2 className="text-[14px] font-semibold text-ink">{title}</h2>
      {action}
    </header>
  );
}

export function SeeAllLink({ href }: { href: string }) {
  return (
    <Link
      href={href}
      className="text-[11.5px] font-medium text-primary hover:underline"
    >
      Voir tout
    </Link>
  );
}

export function Badge({
  children,
  tone = "primary",
}: {
  children: React.ReactNode;
  tone?: "primary" | "danger";
}) {
  const tones = {
    primary: "bg-primary text-white",
    danger: "bg-danger text-white",
  };
  return (
    <span
      className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

/** Pastille ronde rouge des compteurs non lus. */
export function CountDot({ count }: { count: number }) {
  return (
    <span className="grid size-[18px] shrink-0 place-items-center rounded-full bg-danger text-[10px] font-bold text-white">
      {count}
    </span>
  );
}

/** Bouton d'action du dashboard : bleu plein (primary) ou blanc borde. */
export function ActionButton({
  icon: Icon,
  label,
  href,
  variant = "ghost",
}: {
  icon: LucideIcon;
  label: string;
  href: string;
  variant?: "primary" | "ghost";
}) {
  const styles =
    variant === "primary"
      ? "bg-primary text-white border-primary hover:bg-primary-hover"
      : "bg-surface text-ink border-hairline hover:bg-canvas";

  return (
    <Link
      href={href}
      className={`flex h-10 items-center justify-center gap-2 rounded-lg border px-4 text-[12.5px] font-semibold whitespace-nowrap transition-colors ${styles}`}
    >
      <Icon size={15} />
      {label}
    </Link>
  );
}

/** Pilule "Rejoindre" des lignes de reunion : blanche, bord fin, texte bleu. */
export function JoinPill({ href }: { href: string }) {
  return (
    <Link
      href={href}
      className="shrink-0 rounded-lg border border-hairline bg-surface px-3 py-1.5 text-[11.5px] font-semibold text-primary transition-colors hover:border-primary/40 hover:bg-primary-soft"
    >
      Rejoindre
    </Link>
  );
}
