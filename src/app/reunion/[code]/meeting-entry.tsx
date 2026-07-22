"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, MicOff, Video, VideoOff, ShieldCheck } from "lucide-react";
import type { Meeting } from "@/lib/meetings";
import { useIdentity } from "@/components/identity-gate";
import { useLocalCamera } from "@/lib/use-local-camera";
import { Avatar } from "@/components/avatar";
import { MeetingRoom } from "./meeting-room";
import { useAudioLevel } from "@/lib/use-audio-level";
import { AudioLevelMeter } from "@/components/stage/audio-level-meter";

export function MeetingEntry({ meeting }: { meeting: Meeting }) {
  const identity = useIdentity();
  const [joined, setJoined] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const preview = useLocalCamera(camOn, micOn);
  const audioLevel = useAudioLevel(preview.stream, micOn);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) videoRef.current.srcObject = preview.stream;
  }, [preview.stream]);

  if (joined) {
    return <MeetingRoom meeting={meeting} initialMicOn={micOn} initialCamOn={camOn} />;
  }

  const name = identity?.fullName ?? "Participant";

  return (
    <main className="min-h-dvh bg-navy px-4 py-8 text-white">
      <div className="mx-auto grid min-h-[calc(100dvh-4rem)] max-w-5xl items-center gap-8 lg:grid-cols-[1.45fr_0.8fr]">
        <section>
          <p className="mb-3 text-sm font-medium text-white/60">Aperçu avant de rejoindre</p>
          <div className="relative aspect-video overflow-hidden rounded-2xl bg-stage shadow-2xl ring-1 ring-white/10">
            {camOn && preview.stream ? (
              <video ref={videoRef} autoPlay muted playsInline className="size-full scale-x-[-1] object-cover" />
            ) : (
              <div className="grid size-full place-items-center">
                <Avatar name={name} size={96} />
              </div>
            )}
            <span className="absolute bottom-4 left-4 rounded-lg bg-black/55 px-3 py-1.5 text-sm font-semibold">{name}</span>
          </div>

          {preview.error && camOn && (
            <p className="mt-3 rounded-lg bg-danger/15 px-3 py-2 text-sm text-red-200">{preview.error} Vous pouvez rejoindre avec la caméra coupée.</p>
          )}

          <div className="mt-5 flex justify-center gap-3">
            <button type="button" onClick={() => setMicOn((v) => !v)} className={`flex items-center gap-2 rounded-xl px-5 py-3 font-semibold ${micOn ? "bg-white/10 hover:bg-white/15" : "bg-danger hover:bg-danger-hover"}`}>
              {micOn ? <Mic size={19} /> : <MicOff size={19} />}{micOn ? "Micro activé" : "Micro coupé"}
            </button>
            <button type="button" onClick={() => setCamOn((v) => !v)} className={`flex items-center gap-2 rounded-xl px-5 py-3 font-semibold ${camOn ? "bg-white/10 hover:bg-white/15" : "bg-danger hover:bg-danger-hover"}`}>
              {camOn ? <Video size={19} /> : <VideoOff size={19} />}{camOn ? "Caméra activée" : "Caméra coupée"}
            </button>
          </div>
          <div className="mx-auto mt-4 max-w-md rounded-xl bg-white/8 p-4 ring-1 ring-white/10">
            <div className="mb-2 flex items-center justify-between text-xs font-semibold">
              <span>Test du microphone</span>
              <span className={micOn && audioLevel > 0.02 ? "text-accent-green" : "text-white/55"}>
                {!micOn ? "Micro coupé" : audioLevel > 0.02 ? "Voix détectée" : "Parlez pour tester"}
              </span>
            </div>
            <AudioLevelMeter level={micOn ? audioLevel : 0} />
            <p className="mt-2 text-xs text-white/60">La barre doit bouger avec votre voix avant de rejoindre.</p>
          </div>
        </section>

        <aside className="rounded-2xl bg-white p-6 text-ink shadow-xl">
          <div className="mb-4 flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary"><ShieldCheck size={23} /></div>
            <span className="text-sm font-semibold text-accent-green">Identité confirmée</span>
          </div>
          <h1 className="text-2xl font-bold">{meeting.title}</h1>
          <p className="mt-2 text-sm text-muted">Vérifiez votre image et votre son avant d’entrer dans la conférence.</p>
          <div className="mt-6 rounded-xl bg-canvas p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Vous rejoignez comme</p>
            <p className="mt-1 font-bold">{name}</p>
          </div>
          <button type="button" onClick={() => setJoined(true)} className="mt-6 w-full rounded-xl bg-primary px-5 py-3.5 font-bold text-white hover:opacity-90">
            Rejoindre la conférence
          </button>
          <p className="mt-3 text-center text-xs text-muted">Vous pourrez modifier le micro et la caméra pendant la réunion.</p>
        </aside>
      </div>
    </main>
  );
}
