import Link from "next/link";
import { notFound } from "next/navigation";
import { Play, ArrowLeft, CornerUpLeft } from "lucide-react";
import { getSessionUser } from "@/lib/session";
import { getVideoMessage } from "@/lib/data";
import { Avatar } from "@/components/avatar";

export default async function MessageVideoDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const user = await getSessionUser();
  const msg = await getVideoMessage(user.id, id);
  if (!msg) notFound();

  return (
    <div className="mx-auto max-w-[720px] px-5 py-6 md:px-7">
      <Link
        href="/messages-video"
        className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-ink-soft hover:text-ink"
      >
        <ArrowLeft size={15} /> Messages vidéo
      </Link>

      <div className="mt-3 flex items-center gap-3">
        <Avatar name={msg.senderName} src={msg.senderAvatar} size={40} />
        <div>
          <h1 className="text-[17px] font-bold text-ink">{msg.senderName}</h1>
          <p className="text-[12px] text-ink-soft">
            {msg.duration} · {msg.sentOn}
          </p>
        </div>
      </div>

      <div className="mt-5 grid aspect-video place-items-center rounded-card bg-navy">
        <button
          type="button"
          className="grid size-16 place-items-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25"
          aria-label="Lire le message vidéo"
        >
          <Play size={26} fill="currentColor" />
        </button>
      </div>

      <Link
        href="/messages-video/nouveau"
        className="mt-4 inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-[12.5px] font-semibold text-white hover:bg-primary-hover"
      >
        <CornerUpLeft size={15} /> Répondre en vidéo
      </Link>
    </div>
  );
}
