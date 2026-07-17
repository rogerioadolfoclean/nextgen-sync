"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowLeft,
  Mic,
  MicOff,
  Video,
  VideoOff,
  MonitorUp,
  Users,
  Ellipsis,
  SwitchCamera,
} from "lucide-react";
import type { Meeting } from "@/lib/meetings";
import { ControlButton, HangUpButton, type Control } from "./control-bar";
import { VideoTile } from "./video-tile";
import { Elapsed } from "./elapsed";
import { Avatar } from "@/components/avatar";

/** Ecran "Appel vidéo en cours" du mockup mobile. */
export function MobileCall({ meeting }: { meeting: Meeting }) {
  const router = useRouter();
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [sharing, setSharing] = useState(true);

  const speaker = meeting.participants[0];
  const self = meeting.participants[1] ?? speaker;
  const third = meeting.participants[2];

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
    { key: "participants", icon: Users, label: "Participants" },
    { key: "plus", icon: Ellipsis, label: "Plus" },
  ];

  return (
    <div className="flex h-dvh flex-col bg-stage-bar md:hidden">
      <header className="relative flex h-14 shrink-0 items-center justify-between px-3 pt-[env(safe-area-inset-top)]">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Retour"
          className="grid size-9 place-items-center rounded-full bg-white/12 text-white"
        >
          <ArrowLeft size={17} />
        </button>

        <div className="absolute inset-x-0 flex flex-col items-center leading-tight">
          <h1 className="text-[14px] font-semibold text-white">{meeting.title}</h1>
          <Elapsed
            from={meeting.elapsedSeconds}
            className="text-[11px] text-white/60"
          />
        </div>

        <button
          type="button"
          aria-label="Changer de caméra"
          className="z-10 grid size-9 place-items-center rounded-full bg-white/12 text-white"
        >
          <SwitchCamera size={17} />
        </button>
      </header>

      <div className="relative min-h-0 flex-1">
        <VideoTile
          participant={{ id: speaker.id, name: speaker.name, avatarUrl: speaker.avatarUrl }}
          className="size-full"
          rounded="rounded-none"
          showName={false}
          avatarSize={104}
        />

        {third && (
          <div className="absolute right-4 bottom-[136px]">
            <Avatar
              name={third.name}
              src={third.avatarUrl}
              size={34}
              className="ring-2 ring-white/25"
            />
          </div>
        )}

        {/* VideoTile est deja `relative` : on confie le positionnement a un
            conteneur, sinon les deux regles de position se marchent dessus. */}
        <div className="absolute right-3 bottom-3 h-[124px] w-[92px]">
          <VideoTile
            participant={{ id: self.id, name: self.name, avatarUrl: self.avatarUrl }}
            className="size-full shadow-xl ring-1 ring-white/15"
            rounded="rounded-xl"
            showName={false}
            avatarSize={38}
            mirror
          />
        </div>
      </div>

      <div className="shrink-0 bg-stage pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-start justify-between px-5 pt-3">
          {controls.map(({ key, ...c }) => (
            <ControlButton key={key} {...c} round />
          ))}
        </div>
        <div className="flex justify-center py-3">
          <HangUpButton onClick={() => router.push("/accueil")} size={52} />
        </div>
      </div>
    </div>
  );
}
