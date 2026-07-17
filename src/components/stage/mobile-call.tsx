"use client";

import { useRouter } from "next/navigation";
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

/**
 * Etat de la barre de controle, partage avec la vue bureau via le parent pour
 * ne pas ouvrir une seconde connexion LiveKit sur la meme salle.
 */
export type CallControls = {
  micOn: boolean;
  camOn: boolean;
  sharing: boolean;
  toggleMic: () => void;
  toggleCam: () => void;
  toggleShare: () => void;
  /** Flux temps reel local (sa propre camera), si LiveKit est actif. */
  localStream?: MediaStream | null;
  /** Flux de l'orateur principal, si LiveKit est actif. */
  speakerStream?: MediaStream | null;
};

/** Ecran "Appel vidéo en cours" du mockup mobile. */
export function MobileCall({
  meeting,
  controls: c,
}: {
  meeting: Meeting;
  controls: CallControls;
}) {
  const router = useRouter();

  const speaker = meeting.participants[0];
  const self = meeting.participants[1] ?? speaker;
  const third = meeting.participants[2];

  const controls: Control[] = [
    {
      key: "micro",
      icon: c.micOn ? Mic : MicOff,
      label: "Micro",
      tone: c.micOn ? "default" : "off",
      onClick: c.toggleMic,
    },
    {
      key: "camera",
      icon: c.camOn ? Video : VideoOff,
      label: "Caméra",
      tone: c.camOn ? "default" : "off",
      onClick: c.toggleCam,
    },
    {
      key: "partager",
      icon: MonitorUp,
      label: "Partager",
      tone: c.sharing ? "active" : "default",
      onClick: c.toggleShare,
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
          participant={{
            id: speaker.id,
            name: speaker.name,
            avatarUrl: speaker.avatarUrl,
            stream: c.speakerStream ?? undefined,
          }}
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
            participant={{
              id: self.id,
              name: self.name,
              avatarUrl: self.avatarUrl,
              stream: c.localStream ?? undefined,
            }}
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
          {controls.map(({ key, ...control }) => (
            <ControlButton key={key} {...control} round />
          ))}
        </div>
        <div className="flex justify-center py-3">
          <HangUpButton onClick={() => router.push("/accueil")} size={52} />
        </div>
      </div>
    </div>
  );
}
