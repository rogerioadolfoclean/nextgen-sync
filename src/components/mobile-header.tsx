import Link from "next/link";
import { Search } from "lucide-react";

/** Barre du haut de l'app mobile : titre de l'onglet + recherche. */
export function MobileHeader({ title }: { title: string }) {
  return (
    <header className="flex h-[46px] shrink-0 items-center justify-between border-b border-hairline bg-surface px-4 md:hidden">
      <h1 className="text-[17px] font-bold tracking-tight text-ink">{title}</h1>
      <Link
        href="/recherche"
        aria-label="Rechercher"
        className="grid size-8 place-items-center rounded-lg text-ink transition-colors hover:bg-canvas"
      >
        <Search size={18} />
      </Link>
    </header>
  );
}
