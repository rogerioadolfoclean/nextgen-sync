"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  MonitorUp,
  Users,
  MessageSquare,
  Smile,
  Ellipsis,
  Layers,
  ShieldCheck,
  Captions,
  X,
} from "lucide-react";
import type { Meeting } from "@/lib/meetings";
import { ControlBar, type Control } from "@/components/stage/control-bar";
import { VideoTile } from "@/components/stage/video-tile";
import { Whiteboard } from "@/components/stage/whiteboard";
import { ChatPanel, type ChatMessage } from "@/components/stage/chat-panel";
import { Elapsed } from "@/components/stage/elapsed";
import { MobileCall } from "@/components/stage/mobile-call";
import { LiveCaptions } from "@/components/stage/captions";
import { useLiveKit } from "@/lib/use-livekit";
import { useLocalCamera } from "@/lib/use-local-camera";

export function MeetingRoom({ meeting }: { meeting: Meeting }) {
  const router = useRouter();

  // Vraie visio quand les cles LiveKit sont presentes ; sinon `enabled` reste
  // false et l'affichage demo (avatars + etat local) est conserve tel quel.
  const lk = useLiveKit(meeting.code, "host");

  const [localMic, setLocalMic] = useState(true);
  const [localCam, setLocalCam] = useState(true);
  const [localShare, setLocalShare] = useState(true);
  const [showStrip, setShowStrip] = useState(true);
  const [showChat, setShowChat] = useState(true);
  const [showCaptions, setShowCaptions] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>(meeting.messages);

  const micOn = lk.enabled ? lk.micOn : localMic;
  const camOn = lk.enabled ? lk.camOn : localCam;
  const sharing = lk.enabled ? lk.sharing : localShare;
  const toggleMic = lk.enabled ? lk.toggleMic : () => setLocalMic((v) => !v);
  const toggleCam = lk.enabled ? lk.toggleCam : () => setLocalCam((v) => !v);
  const toggleShare = lk.enabled ? lk.toggleShare : () => setLocalShare((v) => !v);

  // Sans LiveKit, on ouvre quand meme la vraie webcam pour la vignette "moi".
  const localCamera = useLocalCamera(!lk.enabled && camOn);
  const selfStream = lk.enabled ? lk.localStream : localCamera.stream;

  /** Flux d'un participant : ma webcam pour la 1re vignette (moi), sinon LiveKit. */
  const streamFor = (index: number) =>
    index === 0
      ? (selfStream ?? undefined)
      : lk.enabled
        ? (lk.remotes[index - 1]?.stream ?? undefined)
        : undefined;

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
      key: "participants",
      icon: Users,
      label: "Participants",
      badge: meeting.participantCount,
    },
    {
      key: "chat",
      icon: MessageSquare,
      label: "Chat",
      badge: showChat ? 0 : meeting.chatUnread,
      onClick: () => setShowChat((v) => !v),
    },
    { key: "reactions", icon: Smile, label: "Réactions" },
    { key: "plus", icon: Ellipsis, label: "Plus" },
  ];

  const send = (text: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `c${Date.now()}`,
        author: "Sarah",
        text,
        time: new Date().toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
  };

  return (
    <>
      <MobileCall
        meeting={meeting}
        controls={{
          micOn,
          camOn,
          sharing,
          toggleMic,
          toggleCam,
          toggleShare,
          localStream: selfStream,
          speakerStream: lk.enabled ? (lk.remotes[0]?.stream ?? null) : null,
        }}
      />

      <div className="hidden h-dvh flex-col bg-stage md:flex">
      <header className="relative flex h-[42px] shrink-0 items-center px-3">
        <span className="hidden text-[11px] font-medium text-white/45 sm:block">
          {meeting.code}
        </span>

        <div className="absolute inset-x-0 flex flex-col items-center justify-center leading-tight">
          <h1 className="text-[12.5px] font-semibold text-white">
            {meeting.title}
          </h1>
          <Elapsed
            from={meeting.elapsedSeconds}
            className="text-[10px] text-white/55"
          />
        </div>

        <div className="z-10 ml-auto flex items-center gap-1">
          <button
            type="button"
            title="Sous-titres IA"
            aria-label="Sous-titres IA"
            aria-pressed={showCaptions}
            onClick={() => setShowCaptions((v) => !v)}
            className={`grid size-7 place-items-center rounded-lg transition-colors hover:bg-white/10 hover:text-white ${
              showCaptions ? "bg-accent-green text-white" : "text-white/85"
            }`}
          >
            <Captions size={15} />
          </button>
          {[
            { icon: Layers, label: "Disposition" },
            { icon: ShieldCheck, label: "Sécurité" },
            { icon: Video, label: "Enregistrer" },
          ].map(({ icon: Icon, label }) => (
            <button
              key={label}
              type="button"
              title={label}
              aria-label={label}
              className="grid size-7 place-items-center rounded-lg text-white/85 transition-colors hover:bg-white/10 hover:text-white"
            >
              <Icon size={15} />
            </button>
          ))}
          <button
            type="button"
            onClick={() => router.push("/reunions")}
            className="ml-1 rounded-lg bg-danger px-3 py-1.5 text-[11.5px] font-semibold text-white transition-colors hover:bg-danger-hover"
          >
            Quitter
          </button>
        </div>
      </header>

      {showStrip && (
        <div className="flex shrink-0 items-center gap-1.5 px-2 pb-2">
          {meeting.participants.map((p, i) => (
            <div
              key={p.id}
              className="relative w-[104px] shrink-0 sm:w-[132px] lg:w-[158px]"
            >
              <VideoTile
                participant={{
                  id: p.id,
                  name: i === 0 ? `${p.name} (moi)` : p.name,
                  avatarUrl: p.avatarUrl,
                  muted: p.muted,
                  stream: streamFor(i),
                }}
                className="aspect-[7/5] w-full"
                avatarSize={34}
                mirror={i === 0}
              />
              <span className="absolute top-1.5 right-1.5 grid size-4 place-items-center rounded bg-black/45">
                <Mic size={9} className="text-accent-green" />
              </span>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setShowStrip(false)}
            aria-label="Masquer les participants"
            className="ml-auto grid size-7 shrink-0 place-items-center rounded-lg text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X size={15} />
          </button>
        </div>
      )}

      <div className="flex min-h-0 flex-1 overflow-hidden rounded-t-xl bg-surface">
        <div className="relative min-w-0 flex-1">
          <Whiteboard initial={meeting.board} className="size-full" />
          {showCaptions && (
            <div className="pointer-events-none absolute inset-x-4 bottom-4 flex justify-center">
              <LiveCaptions onClose={() => setShowCaptions(false)} />
            </div>
          )}
        </div>
        {showChat && (
          <ChatPanel
            messages={messages}
            onSend={send}
            onClose={() => setShowChat(false)}
            className="hidden w-[248px] shrink-0 md:flex"
          />
        )}
      </div>

      <ControlBar controls={controls} compact className="shrink-0" />
      </div>
    </>
  );
}
