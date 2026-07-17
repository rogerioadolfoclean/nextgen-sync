import Link from "next/link";
import {
  Video,
  CirclePlus,
  Calendar,
  ChevronRight,
  ChevronDown,
  type LucideIcon,
} from "lucide-react";
import { ACCENTS } from "@/lib/whiteboard";
import type { UpcomingMeeting, VideoMessage } from "@/lib/data";
import { Avatar } from "./avatar";
import { MobileHeader } from "./mobile-header";

/** Grande tuile d'action : glyphe en haut, libelle en bas. */
function ActionTile({
  icon: Icon,
  label,
  href,
  primary = false,
}: {
  icon: LucideIcon;
  label: string;
  href: string;
  primary?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex flex-1 flex-col items-center justify-center gap-2 rounded-xl border py-3.5 ${
        primary
          ? "border-primary bg-primary text-white"
          : "border-hairline bg-surface text-ink"
      }`}
    >
      <span
        className={`grid size-8 place-items-center rounded-full ${
          primary ? "bg-white/20" : "bg-canvas"
        }`}
      >
        <Icon size={16} />
      </span>
      <span className="text-[11px] font-semibold">{label}</span>
    </Link>
  );
}

export function MobileHome({
  firstName,
  meetings,
  messages,
}: {
  firstName: string;
  meetings: UpcomingMeeting[];
  messages: VideoMessage[];
}) {
  return (
    <div className="md:hidden">
      <MobileHeader title="Accueil" />
      <div className="px-4 py-4">
      <h2 className="text-[21px] font-bold tracking-tight text-ink">
        Bonjour, {firstName} <span aria-hidden>👋</span>
      </h2>
      {/* Le mockup accorde au feminin ("Prête") pour sa persona. L'app sert de
          vrais comptes : on garde la forme inclusive plutot que de deduire le
          genre d'un prenom. */}
      <p className="mt-1 text-[12.5px] text-ink-soft">
        Prêt·e pour votre prochaine réunion ?
      </p>

      <div className="mt-4 flex gap-2.5">
        <ActionTile primary icon={Video} label="Nouvelle réunion" href="/reunions/nouvelle" />
        <ActionTile icon={CirclePlus} label="Rejoindre" href="/rejoindre" />
        <ActionTile icon={Calendar} label="Programmer" href="/reunions/programmer" />
      </div>

      <h3 className="mt-6 text-[14.5px] font-bold text-ink">
        Prochaines réunions
      </h3>
      <ul className="mt-1 divide-y divide-hairline">
        {meetings.map((m, i) => (
          <li key={m.id} className="flex items-center gap-3 py-3">
            <span
              className="grid size-9 shrink-0 place-items-center rounded-full text-white"
              style={{ background: ACCENTS[m.accent].border }}
            >
              <Video size={15} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13.5px] font-semibold text-ink">
                {m.title}
              </span>
              <span className="block truncate text-[11.5px] text-ink-soft">
                {m.whenShort}
              </span>
            </span>
            {i === 0 ? (
              <Link
                href={`/reunion/${m.code}`}
                className="shrink-0 rounded-lg bg-primary px-3 py-1.5 text-[11.5px] font-semibold text-white"
              >
                Rejoindre
              </Link>
            ) : (
              <Link
                href={`/reunion/${m.code}`}
                aria-label={`Ouvrir ${m.title}`}
                className="shrink-0 text-ink-soft"
              >
                <ChevronRight size={17} />
              </Link>
            )}
          </li>
        ))}
      </ul>

      <Link
        href="/reunions"
        className="mt-1 flex items-center gap-1.5 border-b border-hairline pb-3.5 text-[12.5px] font-semibold text-primary"
      >
        <ChevronDown size={15} />
        Voir tout le calendrier
      </Link>

      <h3 className="mt-5 text-[14.5px] font-bold text-ink">Messages vidéo</h3>
      <ul className="mt-1">
        {messages.map((v) => (
          <li key={v.id}>
            <Link
              href={`/messages-video/${v.id}`}
              className="flex items-center gap-3 py-3"
            >
              <Avatar name={v.senderName} src={v.senderAvatar} size={38} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13.5px] font-semibold text-ink">
                  {v.senderName}
                </span>
                <span className="block truncate text-[11.5px] text-ink-soft">
                  {v.unread} nouveau message vidéo
                </span>
              </span>
              {v.unread > 0 && (
                <span className="grid size-[19px] shrink-0 place-items-center rounded-full bg-danger text-[10px] font-bold text-white">
                  {v.unread + 1}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
      </div>
    </div>
  );
}
