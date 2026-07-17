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

export function MeetingRoom({ meeting }: { meeting: Meeting }) {
  const router = useRouter();
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [sharing, setSharing] = useState(true);
  const [showStrip, setShowStrip] = useState(true);
  const [showChat, setShowChat] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>(meeting.messages);

  const controls: Control[] = [
    {
      key: "micro",
      icon: micOn ? Mic : MicOff,
      label: "Micro",
      tone: micOn ? "default" : "off",
      onClick: () => setMicOn((v) => !v),
    },
    {
      key: "camera",
      icon: camOn ? Video : VideoOff,
      label: "Caméra",
      tone: camOn ? "default" : "off",
      onClick: () => setCamOn((v) => !v),
    },
    {
      key: "partager",
      icon: MonitorUp,
      label: "Partager",
      tone: sharing ? "active" : "default",
      onClick: () => setSharing((v) => !v),
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
    <div className="flex h-dvh flex-col bg-stage">
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
          {[
            { icon: Layers, label: "Disposition" },
            { icon: ShieldCheck, label: "Sécurité" },
            { icon: Captions, label: "Sous-titres IA" },
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
          {meeting.participants.map((p) => (
            <div
              key={p.id}
              className="relative w-[104px] shrink-0 sm:w-[132px] lg:w-[158px]"
            >
              <VideoTile
                participant={{ id: p.id, name: p.name, avatarUrl: p.avatarUrl, muted: p.muted }}
                className="aspect-[7/5] w-full"
                avatarSize={34}
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
        <Whiteboard initial={meeting.board} className="min-w-0 flex-1" />
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
  );
}
