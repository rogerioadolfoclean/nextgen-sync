import Link from "next/link";
import { MessageSquare, ChevronRight } from "lucide-react";
import { getSessionUser } from "@/lib/session";
import { getVideoMessages } from "@/lib/data";
import { Avatar } from "@/components/avatar";
import { Card } from "@/components/ui";
import { CountDot } from "@/components/ui";
import { PageHeader, EmptyState } from "@/components/page-header";

export const metadata = { title: "Messages vidéo — NextGen Sync" };

export default async function MessagesVideoPage() {
  const user = await getSessionUser();
  const messages = await getVideoMessages(user.id);

  return (
    <div className="mx-auto max-w-[1000px] px-5 py-6 md:px-7">
      <PageHeader
        title="Messages vidéo"
        subtitle="Enregistrez et partagez de courtes vidéos, sans planifier de réunion."
        action={
          <Link
            href="/messages-video/nouveau"
            className="flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-[12.5px] font-semibold text-white hover:bg-primary-hover"
          >
            <MessageSquare size={15} /> Nouveau message
          </Link>
        }
      />

      <div className="mt-6">
        {messages.length === 0 ? (
          <EmptyState
            icon={MessageSquare}
            title="Aucun message vidéo"
            text="Enregistrez un message pour le partager avec votre équipe."
          />
        ) : (
          <Card>
            <ul className="divide-y divide-hairline">
              {messages.map((v) => (
                <li key={v.id}>
                  <Link
                    href={`/messages-video/${v.id}`}
                    className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-canvas"
                  >
                    <Avatar name={v.senderName} src={v.senderAvatar} size={38} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[14px] font-semibold text-ink">
                        {v.senderName}
                      </span>
                      <span className="block truncate text-[12px] text-ink-soft">
                        {v.duration} · {v.sentOn}
                      </span>
                    </span>
                    {v.unread > 0 ? (
                      <CountDot count={v.unread} />
                    ) : (
                      <ChevronRight size={16} className="shrink-0 text-ink-soft" />
                    )}
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
