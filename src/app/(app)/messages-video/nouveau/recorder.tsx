"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Video,
  Monitor,
  Circle,
  Square,
  Download,
  RotateCcw,
  Trash2,
} from "lucide-react";

type Phase = "setup" | "preview" | "recording" | "recorded";
type Source = "camera" | "screen" | null;

function fmt(total: number) {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

/**
 * Enregistreur de message video reellement fonctionnel : capture la webcam
 * (getUserMedia) ou l'ecran (getDisplayMedia), enregistre via MediaRecorder,
 * puis propose la relecture et le telechargement du fichier .webm.
 *
 * 100% cote navigateur — aucune cle externe requise. L'envoi vers le stockage
 * (Vercel Blob) + la table `video_messages` s'ajoute quand la base est branchee.
 */
export function VideoRecorder() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const [phase, setPhase] = useState<Phase>("setup");
  const [source, setSource] = useState<Source>(null);
  const [error, setError] = useState<string | null>(null);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  const [seconds, setSeconds] = useState(0);

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  const attach = useCallback((stream: MediaStream) => {
    stopStream();
    streamRef.current = stream;
    const el = videoRef.current;
    if (el) {
      el.srcObject = stream;
      el.muted = true;
      el.play().catch(() => {});
    }
  }, [stopStream]);

  async function startCamera() {
    setError(null);
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      attach(s);
      setSource("camera");
      setPhase("preview");
    } catch (e) {
      setError(
        e instanceof DOMException && e.name === "NotAllowedError"
          ? "Accès à la caméra refusé."
          : "Caméra indisponible.",
      );
    }
  }

  async function startScreen() {
    setError(null);
    try {
      const s = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });
      attach(s);
      setSource("screen");
      setPhase("preview");
      // L'utilisateur peut couper le partage depuis la barre du navigateur.
      s.getVideoTracks()[0]?.addEventListener("ended", () => {
        if (recorderRef.current?.state === "recording") {
          recorderRef.current.stop();
        } else {
          reset();
        }
      });
    } catch {
      setError("Partage d'écran annulé.");
    }
  }

  function startRecording() {
    const stream = streamRef.current;
    if (!stream) {
      setError("Choisissez d'abord la caméra ou l'écran.");
      return;
    }
    chunksRef.current = [];
    const mime = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
      ? "video/webm;codecs=vp9"
      : "video/webm";
    const rec = new MediaRecorder(stream, { mimeType: mime });
    rec.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };
    rec.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      setRecordedUrl(url);
      setPhase("recorded");
      // Bascule le lecteur sur le fichier enregistre.
      const el = videoRef.current;
      if (el) {
        el.srcObject = null;
        el.src = url;
        el.muted = false;
        el.controls = true;
      }
      stopStream();
    };
    rec.start();
    recorderRef.current = rec;
    setSeconds(0);
    setPhase("recording");
  }

  function stopRecording() {
    recorderRef.current?.stop();
  }

  const reset = useCallback(() => {
    stopStream();
    recorderRef.current = null;
    if (recordedUrl) URL.revokeObjectURL(recordedUrl);
    setRecordedUrl(null);
    setSource(null);
    setSeconds(0);
    setError(null);
    setPhase("setup");
    const el = videoRef.current;
    if (el) {
      el.srcObject = null;
      el.removeAttribute("src");
      el.controls = false;
      el.load();
    }
  }, [recordedUrl, stopStream]);

  // Chrono pendant l'enregistrement.
  useEffect(() => {
    if (phase !== "recording") return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [phase]);

  // Libere la camera / l'ecran au demontage.
  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  return (
    <div>
      {/* Zone video : preview live, enregistrement, ou fichier final */}
      <div className="relative grid aspect-video place-items-center overflow-hidden rounded-card bg-navy text-white/60">
        <video
          ref={videoRef}
          playsInline
          className={`size-full object-contain ${
            phase === "setup" ? "hidden" : "block"
          } ${source === "camera" && phase !== "recorded" ? "-scale-x-100" : ""}`}
        />

        {phase === "setup" && (
          <div className="text-center">
            <Circle size={40} className="mx-auto text-danger" fill="currentColor" />
            <p className="mt-3 text-[13px]">Prêt à enregistrer</p>
          </div>
        )}

        {phase === "recording" && (
          <span className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-semibold text-white">
            <span className="size-2 animate-pulse rounded-full bg-danger" />
            REC {fmt(seconds)}
          </span>
        )}
      </div>

      {error && (
        <p className="mt-3 rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-[12px] text-danger">
          {error}
        </p>
      )}

      {/* Commandes selon la phase */}
      {phase === "setup" && (
        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={startCamera}
            className="flex h-11 items-center justify-center gap-2 rounded-lg border border-hairline bg-surface text-[12.5px] font-semibold text-ink hover:bg-canvas"
          >
            <Video size={15} /> Caméra
          </button>
          <button
            type="button"
            onClick={startScreen}
            className="flex h-11 items-center justify-center gap-2 rounded-lg border border-hairline bg-surface text-[12.5px] font-semibold text-ink hover:bg-canvas"
          >
            <Monitor size={15} /> Écran
          </button>
        </div>
      )}

      {phase === "preview" && (
        <div className="mt-4 flex gap-3">
          <button
            type="button"
            onClick={startRecording}
            className="flex h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-danger text-[13px] font-semibold text-white hover:bg-danger-hover"
          >
            <Circle size={13} fill="currentColor" /> Démarrer l&apos;enregistrement
          </button>
          <button
            type="button"
            onClick={reset}
            className="flex h-11 items-center justify-center gap-2 rounded-lg border border-hairline bg-surface px-4 text-[12.5px] font-semibold text-ink hover:bg-canvas"
          >
            <RotateCcw size={15} /> Changer
          </button>
        </div>
      )}

      {phase === "recording" && (
        <button
          type="button"
          onClick={stopRecording}
          className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-ink text-[13px] font-semibold text-white hover:opacity-90"
        >
          <Square size={13} fill="currentColor" /> Arrêter l&apos;enregistrement
        </button>
      )}

      {phase === "recorded" && recordedUrl && (
        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href={recordedUrl}
            download={`message-video-${Date.now()}.webm`}
            className="flex h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-primary text-[13px] font-semibold text-white hover:bg-primary-hover"
          >
            <Download size={15} /> Télécharger
          </a>
          <button
            type="button"
            onClick={reset}
            className="flex h-11 items-center justify-center gap-2 rounded-lg border border-hairline bg-surface px-4 text-[12.5px] font-semibold text-ink hover:bg-canvas"
          >
            <Trash2 size={15} /> Recommencer
          </button>
        </div>
      )}
    </div>
  );
}
