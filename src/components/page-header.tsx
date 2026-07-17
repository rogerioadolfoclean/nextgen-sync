import { MobileHeader } from "@/components/mobile-header";

/**
 * En-tete standard d'un module : titre + sous-titre + actions.
 * Sur mobile, affiche aussi la barre du haut avec le titre du module.
 */
export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <>
      <MobileHeader title={title} />
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-hairline pb-5 md:border-0 md:pb-0">
        <div>
          <h1 className="hidden text-[22px] font-bold tracking-tight text-ink md:block">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1 text-[13px] text-ink-soft">{subtitle}</p>
          )}
        </div>
        {action && <div className="flex flex-wrap gap-2.5">{action}</div>}
      </div>
    </>
  );
}

/** Etat vide d'une liste (aucun element). */
export function EmptyState({
  icon: Icon,
  title,
  text,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  text?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-card border border-dashed border-hairline bg-surface px-6 py-14 text-center">
      <span className="grid size-11 place-items-center rounded-xl bg-canvas text-ink-soft">
        <Icon size={20} />
      </span>
      <p className="mt-3 text-[14px] font-semibold text-ink">{title}</p>
      {text && <p className="mt-1 max-w-[360px] text-[12.5px] text-ink-soft">{text}</p>}
    </div>
  );
}
