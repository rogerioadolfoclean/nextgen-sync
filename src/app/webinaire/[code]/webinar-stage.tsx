"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  MonitorUp,
  MessageSquare,
  MessageCircleQuestionMark,
  ChartNoAxesColumn,
  Ellipsis,
} from "lucide-react";
import type { Webinar } from "@/lib/webinars";
import { ControlBar, type Control } from "@/components/stage/control-bar";
import { VideoTile } from "@/components/stage/video-tile";
import { ParticipantsPanel } from "@/components/stage/participants-panel";
import { PollPanel } from "@/components/stage/poll-panel";
import { Elapsed } from "@/components/stage/elapsed";
import { useLiveKit } from "@/lib/use-livekit";

export function WebinarStage({ webinar }: { webinar: Webinar }) {
  const router = useRouter();

  // L'hote publie ; les cles LiveKit activent la vraie video, sinon rendu demo.
  const lk = useLiveKit(webinar.code, "host");
  const [localMic, setLocalMic] = useState(true);
  const [localCam, setLocalCam] = useState(true);
  const [localShare, setLocalShare] = useState(true);

  const micOn = lk.enabled ? lk.micOn : localMic;
  const camOn = lk.enabled ? lk.camOn : localCam;
  const sharing = lk.enabled ? lk.sharing : localShare;
  const toggleMic = lk.enabled ? lk.toggleMic : () => setLocalMic((v) => !v);
  const toggleCam = lk.enabled ? lk.toggleCam : () => setLocalCam((v) => !v);
  const toggleShare = lk.enabled ? lk.toggleShare : () => setLocalShare((v) => !v);

  const speaker = webinar.participants[0];
  const strip = webinar.participants.slice(1, 5);
  const streamFor = (index: number) =>
    lk.enabled ? (lk.remotes[index]?.stream ?? undefined) : undefined;

  const controls: Control[] = [
    {
      key: "micro",
      icon: micOn ? Mic : MicOff,
      label: "Micro",
      tone: micOn ? "default" : "off",
      onClick: toggleMic,
    },
    {
      key: "camera",
      icon: camOn ? Video : VideoOff,
      label: "Caméra",
      tone: camOn ? "default" : "off",
      onClick: toggleCam,
    },
    {
      key: "partager",
      icon: MonitorUp,
      label: "Partager",
      tone: sharing ? "active" : "default",
      onClick: toggleShare,
    },
    {
      key: "chat",
      icon: MessageSquare,
      label: "Chat",
      badge: webinar.chatUnread,
    },
    { key: "qr", icon: MessageCircleQuestionMark, label: "Q&R" },
    { key: "sondages", icon: ChartNoAxesColumn, label: "Sondages" },
    { key: "plus", icon: Ellipsis, label: "Plus" },
  ];

  return (
    <div className="flex h-dvh flex-col bg-surface lg:flex-row">
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <header className="flex h-[46px] shrink-0 items-center gap-2.5 border-b border-hairline px-4">
          <h1 className="truncate text-[13.5px] font-semibold text-ink">
            {webinar.title}
          </h1>
          {webinar.live && (
            <span className="shrink-0 rounded bg-danger px-1.5 py-0.5 text-[9.5px] font-bold tracking-wide text-white">
              EN DIRECT
            </span>
          )}
          <span className="shrink-0 text-[11.5px] text-ink-soft">
            {webinar.participantCount.toLocaleString("fr-FR")} participants
          </span>
          <Elapsed
            from={webinar.elapsedSeconds}
            className="ml-auto shrink-0 text-[11.5px] text-ink-soft"
          />
        </header>

        <div className="relative min-h-0 flex-1 bg-stage-bar">
          <VideoTile
            participant={{
              id: speaker.id,
              name: speaker.name,
              avatarUrl: speaker.avatarUrl,
              stream: lk.enabled ? (lk.localStream ?? undefined) : undefined,
            }}
            className="size-full"
            rounded="rounded-none"
            showName={false}
            avatarSize={96}
            mirror={lk.enabled}
          />

          <div className="absolute right-3 bottom-3 left-3 flex justify-center gap-2">
            {strip.map((p, i) => (
              <VideoTile
                key={p.id}
                participant={{
                  id: p.id,
                  name: p.name,
                  avatarUrl: p.avatarUrl,
                  muted: p.muted,
                  stream: streamFor(i),
                }}
                className="h-[74px] w-[104px] shadow-lg sm:h-[86px] sm:w-[122px]"
                avatarSize={34}
              />
            ))}
          </div>
        </div>

        <ControlBar
          controls={controls}
          onHangUp={() => router.push("/webinaires")}
          className="shrink-0"
        />
      </div>

      <aside className="flex w-full shrink-0 flex-col overflow-hidden border-t border-hairline bg-surface lg:w-[300px] lg:border-t-0 lg:border-l">
        <div className="scroll-clean flex min-h-0 flex-1 flex-col overflow-y-auto">
          <ParticipantsPanel
            total={webinar.participantCount}
            participants={webinar.participants}
          />
          {webinar.poll && <PollPanel poll={webinar.poll} />}
        </div>
      </aside>
    </div>
  );
}
