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
import { AudioLevelMeter } from "./audio-level-meter";

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
  participants,
  audioLevel,
  liveStatus,
}: {
  meeting: Meeting;
  controls: CallControls;
  participants: Array<{ id: string; name: string; avatarUrl?: string | null; isSelf?: boolean }>;
  audioLevel: number;
  liveStatus: "transmis" | "connexion" | "non-configure";
}) {
  const router = useRouter();
  const [sheet, setSheet] = useState<"participants" | "more" | null>(null);
  const [cameraMessage, setCameraMessage] = useState("");

  const self = participants.find((p) => p.isSelf) ?? participants[0];
  const speaker = participants.find((p) => !p.isSelf) ?? self;
  const third = participants.filter((p) => !p.isSelf)[1];

  const switchCamera = async () => {
    const track = c.localStream?.getVideoTracks()[0];
    if (!track) {
      setCameraMessage("Activez d’abord la caméra.");
      return;
    }
    const current = track.getSettings().facingMode;
    try {
      await track.applyConstraints({ facingMode: current === "environment" ? "user" : "environment" });
      setCameraMessage("Caméra changée");
    } catch {
      setCameraMessage("Une seule caméra est disponible sur cet appareil.");
    }
    setTimeout(() => setCameraMessage(""), 2200);
  };

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
    { key: "participants", icon: Users, label: "Participants", badge: participants.length, tone: sheet === "participants" ? "active" : "default", onClick: () => setSheet(sheet === "participants" ? null : "participants") },
    { key: "plus", icon: Ellipsis, label: "Plus", tone: sheet === "more" ? "active" : "default", onClick: () => setSheet(sheet === "more" ? null : "more") },
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
          onClick={switchCamera}
          className="z-10 grid size-9 place-items-center rounded-full bg-white/12 text-white"
        >
          <SwitchCamera size={17} />
        </button>
        {cameraMessage && <span className="absolute top-14 right-3 z-30 rounded-lg bg-black/75 px-3 py-2 text-xs text-white">{cameraMessage}</span>}
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
        <div className="px-5 pt-3">
          <div className="flex items-center gap-3">
            <AudioLevelMeter level={c.micOn ? audioLevel : 0} />
            <span className={`shrink-0 text-[10px] font-semibold ${liveStatus === "transmis" ? "text-accent-green" : "text-amber-300"}`}>
              {liveStatus === "transmis" ? "Audio transmis" : liveStatus === "connexion" ? "Connexion…" : "Non transmis"}
            </span>
          </div>
        </div>
        <div className="flex items-start justify-between px-5 pt-3">
          {controls.map(({ key, ...control }) => (
            <ControlButton key={key} {...control} round />
          ))}
        </div>
        <div className="flex justify-center py-3">
          <HangUpButton onClick={() => router.push("/accueil")} size={52} />
        </div>
      </div>

      {sheet && (
        <div className="absolute inset-x-3 bottom-28 z-40 max-h-[55dvh] overflow-y-auto rounded-2xl bg-white p-4 text-ink shadow-2xl">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-bold">{sheet === "participants" ? `Participants (${participants.length})` : "Plus d’options"}</h2>
            <button type="button" onClick={() => setSheet(null)} className="rounded-lg bg-canvas px-3 py-1 text-sm">Fermer</button>
          </div>
          {sheet === "participants" ? participants.map((p) => (
            <div key={p.id} className="flex items-center gap-3 border-t border-border py-3 first:border-0">
              <Avatar name={p.name} src={p.avatarUrl} size={34} />
              <span className="font-medium">{p.name}</span>
            </div>
          )) : (
            <div className="grid gap-2">
              <button type="button" onClick={async () => { await navigator.clipboard.writeText(window.location.href); setSheet(null); }} className="rounded-xl bg-canvas p-3 text-left font-semibold">Copier le lien de la réunion</button>
              <button type="button" onClick={() => { c.toggleShare(); setSheet(null); }} className="rounded-xl bg-canvas p-3 text-left font-semibold">{c.sharing ? "Arrêter le partage" : "Partager l’écran"}</button>
              <button type="button" onClick={() => router.push("/accueil")} className="rounded-xl bg-red-50 p-3 text-left font-semibold text-danger">Quitter la réunion</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
