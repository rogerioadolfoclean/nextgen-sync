import Link from "next/link";
import { PenLine, Plus, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui";
import { PageHeader } from "@/components/page-header";

export const metadata = { title: "Tableau blanc — NextGen Sync" };

/** Tableaux de demonstration (relies aux salles de reunion existantes). */
const BOARDS = [
  { code: "brainstorming-produit", title: "Brainstorming produit", updated: "Aujourd'hui" },
  { code: "revue-produit", title: "Revue produit", updated: "Hier" },
  { code: "retro-sprint", title: "Rétrospective sprint", updated: "Cette semaine" },
];

export default function TableauBlancPage() {
  return (
    <div className="mx-auto max-w-[1000px] px-5 py-6 md:px-7">
      <PageHeader
        title="Tableau blanc"
        subtitle="Dessinez, notez et partagez vos idées en temps réel."
        action={
          <Link
            href="/reunions/nouvelle"
            className="flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-[12.5px] font-semibold text-white hover:bg-primary-hover"
          >
            <Plus size={15} /> Nouveau tableau
          </Link>
        }
      />

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {BOARDS.map((b) => (
          <Link
            key={b.code}
            href={`/reunion/${b.code}`}
            className="group flex flex-col overflow-hidden rounded-card border border-hairline bg-surface transition-colors hover:border-primary/40"
          >
            <span className="grid h-28 place-items-center bg-canvas text-ink-soft">
              <PenLine size={26} />
            </span>
            <span className="flex items-center gap-2 px-4 py-3">
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13.5px] font-semibold text-ink">
                  {b.title}
                </span>
                <span className="block text-[11.5px] text-ink-soft">
                  Modifié {b.updated}
                </span>
              </span>
              <ChevronRight size={15} className="shrink-0 text-ink-soft" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
