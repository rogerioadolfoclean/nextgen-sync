import Link from "next/link";
import { Video, CirclePlus, Calendar, MessageSquare, ChevronRight, Play } from "lucide-react";
import { getSessionUser } from "@/lib/session";
import { getUpcomingMeetings, getRecentRecordings, getVideoMessages } from "@/lib/data";
import { Avatar } from "@/components/avatar";
import { Card, CardHeader, SeeAllLink, Badge, CountDot, ActionButton, JoinPill } from "@/components/ui";

export default async function AccueilPage() {
  const user = await getSessionUser();
  const [meetings, recordings, messages] = await Promise.all([
    getUpcomingMeetings(user.id),
    getRecentRecordings(user.id),
    getVideoMessages(user.id),
  ]);

  const firstName = user.name.split(" ")[0];

  return (
    <div className="mx-auto max-w-[1100px] px-5 py-6 md:px-7">
      <h1 className="text-[22px] font-bold tracking-tight text-ink">
        Bienvenue, {firstName} <span aria-hidden>👋</span>
      </h1>
      <p className="mt-1 text-[13px] text-ink-soft">Voici vos activités du jour.</p>

      <div className="mt-5 flex flex-wrap gap-2.5">
        <ActionButton variant="primary" icon={Video} label="Nouvelle réunion" href="/reunions/nouvelle" />
        <ActionButton icon={CirclePlus} label="Rejoindre" href="/rejoindre" />
        <ActionButton icon={Calendar} label="Programmer" href="/reunions/programmer" />
        <ActionButton icon={MessageSquare} label="Message vidéo" href="/messages-video/nouveau" />
      </div>

      <div className="mt-6 grid grid-cols-1 items-start gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Prochaines réunions" action={<SeeAllLink href="/reunions" />} />
          <ul className="divide-y divide-hairline border-t border-hairline">
            {meetings.map((m) => (
              <li key={m.id} className="flex items-center gap-3 px-4 py-3">
                <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary-soft text-primary">
                  <Calendar size={15} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-semibold text-ink">{m.title}</span>
                  <span className="block truncate text-[11.5px] text-ink-soft">{m.when}</span>
                </span>
                <JoinPill href={`/reunion/${m.code}`} />
              </li>
            ))}
          </ul>
        </Card>

        <div className="grid gap-4">
          <Card>
            <CardHeader title="Enregistrements récents" action={<SeeAllLink href="/enregistrements" />} />
            <ul className="divide-y divide-hairline border-t border-hairline">
              {recordings.map((r) => (
                <li key={r.id}>
                  <Link href={`/enregistrements/${r.id}`} className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-canvas">
                    <span className="grid h-[34px] w-[54px] shrink-0 place-items-center rounded-md bg-navy text-white/90">
                      <Play size={13} fill="currentColor" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] font-semibold text-ink">{r.title}</span>
                      <span className="block truncate text-[11.5px] text-ink-soft">
                        Enregistré le {r.recordedOn} · {r.duration}
                      </span>
                    </span>
                    <ChevronRight size={15} className="shrink-0 text-ink-soft" />
                  </Link>
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <CardHeader title="Messages vidéo" action={<Badge>Nouveau</Badge>} />
            <ul className="divide-y divide-hairline border-t border-hairline">
              {messages.map((v) => (
                <li key={v.id}>
                  <Link href={`/messages-video/${v.id}`} className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-canvas">
                    <Avatar name={v.senderName} src={v.senderAvatar} size={30} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] font-semibold text-ink">{v.senderName}</span>
                      <span className="block truncate text-[11.5px] text-ink-soft">
                        {v.duration} · {v.sentOn}
                      </span>
                    </span>
                    {v.unread > 0 && <CountDot count={v.unread} />}
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
