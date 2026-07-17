import Link from "next/link";
import { Radio, Users, ChevronRight } from "lucide-react";
import { listWebinars } from "@/lib/webinars";
import { Card } from "@/components/ui";
import { PageHeader, EmptyState } from "@/components/page-header";

export const metadata = { title: "Webinaires — NextGen Sync" };

export default async function WebinairesPage() {
  const webinars = await listWebinars();

  return (
    <div className="mx-auto max-w-[1000px] px-5 py-6 md:px-7">
      <PageHeader
        title="Webinaires"
        subtitle="Diffusez à grande échelle — jusqu'à 100 000 participants."
      />

      <div className="mt-6">
        {webinars.length === 0 ? (
          <EmptyState icon={Radio} title="Aucun webinaire" />
        ) : (
          <Card>
            <ul className="divide-y divide-hairline">
              {webinars.map((w) => (
                <li key={w.code}>
                  <Link
                    href={`/webinaire/${w.code}`}
                    className="flex items-center gap-3 px-4 py-4 transition-colors hover:bg-canvas"
                  >
                    <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-danger/10 text-danger">
                      <Radio size={16} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="truncate text-[14px] font-semibold text-ink">
                          {w.title}
                        </span>
                        {w.live && (
                          <span className="shrink-0 rounded bg-danger px-1.5 py-0.5 text-[9.5px] font-bold tracking-wide text-white">
                            EN DIRECT
                          </span>
                        )}
                      </span>
                      <span className="mt-0.5 flex items-center gap-2 text-[12px] text-ink-soft">
                        {w.when}
                        {w.participantCount > 0 && (
                          <>
                            <span aria-hidden>·</span>
                            <span className="flex items-center gap-1">
                              <Users size={12} />
                              {w.participantCount.toLocaleString("fr-FR")}
                            </span>
                          </>
                        )}
                      </span>
                    </span>
                    <ChevronRight size={16} className="shrink-0 text-ink-soft" />
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        )}
      </div>
    </div>
  );
}
