import Link from "next/link";
import { Video, CirclePlus, Calendar, Clock } from "lucide-react";
import { getSessionUser } from "@/lib/session";
import { getUpcomingMeetings } from "@/lib/data";
import { ACCENTS } from "@/lib/whiteboard";
import { Card } from "@/components/ui";
import { PageHeader, EmptyState } from "@/components/page-header";

export const metadata = { title: "Réunions — NextGen Sync" };

export default async function ReunionsPage() {
  const user = await getSessionUser();
  const meetings = await getUpcomingMeetings(user.id);

  return (
    <div className="mx-auto max-w-[1000px] px-5 py-6 md:px-7">
      <PageHeader
        title="Réunions"
        subtitle="Vos prochaines réunions et vos raccourcis."
        action={
          <>
            <Link
              href="/reunions/nouvelle"
              className="flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-[12.5px] font-semibold text-white hover:bg-primary-hover"
            >
              <Video size={15} /> Nouvelle réunion
            </Link>
            <Link
              href="/reunions/programmer"
              className="flex h-10 items-center gap-2 rounded-lg border border-hairline bg-surface px-4 text-[12.5px] font-semibold text-ink hover:bg-canvas"
            >
              <Calendar size={15} /> Programmer
            </Link>
            <Link
              href="/rejoindre"
              className="flex h-10 items-center gap-2 rounded-lg border border-hairline bg-surface px-4 text-[12.5px] font-semibold text-ink hover:bg-canvas"
            >
              <CirclePlus size={15} /> Rejoindre
            </Link>
          </>
        }
      />

      <div className="mt-6">
        {meetings.length === 0 ? (
          <EmptyState
            icon={Video}
            title="Aucune réunion à venir"
            text="Créez une nouvelle réunion ou programmez-en une pour la voir apparaître ici."
          />
        ) : (
          <Card>
            <ul className="divide-y divide-hairline">
              {meetings.map((m) => (
                <li key={m.id} className="flex items-center gap-3 px-4 py-4">
                  <span
                    className="grid size-9 shrink-0 place-items-center rounded-lg text-white"
                    style={{ background: ACCENTS[m.accent].border }}
                  >
                    <Video size={16} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[14px] font-semibold text-ink">
                      {m.title}
                    </span>
                    <span className="mt-0.5 flex items-center gap-1.5 text-[12px] text-ink-soft">
                      <Clock size={12} /> {m.when}
                    </span>
                  </span>
                  <Link
                    href={`/reunion/${m.code}`}
                    className="shrink-0 rounded-lg bg-primary px-3.5 py-2 text-[12px] font-semibold text-white hover:bg-primary-hover"
                  >
                    Rejoindre
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
