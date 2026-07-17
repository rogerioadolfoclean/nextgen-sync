import Link from "next/link";
import { CirclePlay, Play, ChevronRight } from "lucide-react";
import { getSessionUser } from "@/lib/session";
import { getRecentRecordings } from "@/lib/data";
import { Card } from "@/components/ui";
import { PageHeader, EmptyState } from "@/components/page-header";

export const metadata = { title: "Enregistrements — NextGen Sync" };

export default async function EnregistrementsPage() {
  const user = await getSessionUser();
  const recordings = await getRecentRecordings(user.id);

  return (
    <div className="mx-auto max-w-[1000px] px-5 py-6 md:px-7">
      <PageHeader
        title="Enregistrements"
        subtitle="Retrouvez et partagez vos réunions enregistrées."
      />

      <div className="mt-6">
        {recordings.length === 0 ? (
          <EmptyState
            icon={CirclePlay}
            title="Aucun enregistrement"
            text="Activez l'enregistrement pendant une réunion pour le retrouver ici."
          />
        ) : (
          <Card>
            <ul className="divide-y divide-hairline">
              {recordings.map((r) => (
                <li key={r.id}>
                  <Link
                    href={`/enregistrements/${r.id}`}
                    className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-canvas"
                  >
                    <span className="grid h-[42px] w-[66px] shrink-0 place-items-center rounded-lg bg-navy text-white/90">
                      <Play size={15} fill="currentColor" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[14px] font-semibold text-ink">
                        {r.title}
                      </span>
                      <span className="block truncate text-[12px] text-ink-soft">
                        Enregistré le {r.recordedOn} · {r.duration}
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
