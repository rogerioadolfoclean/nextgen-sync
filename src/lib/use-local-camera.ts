"use client";

import { useEffect, useRef, useState } from "react";

export type LocalCamera = {
  stream: MediaStream | null;
  error: string | null;
};

/**
 * Ouvre la vraie webcam du navigateur via getUserMedia des que `active` est vrai,
 * et libere la camera quand il repasse a faux.
 *
 * Utilise en mode demo (sans LiveKit) pour que le bouton Camera affiche
 * reellement le flux de l'utilisateur. Quand LiveKit est actif, c'est lui qui
 * gere la publication et ce hook reste inactif.
 */
export function useLocalCamera(active: boolean, withAudio = false): LocalCamera {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    let cancelled = false;

    function stop() {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      setStream(null);
    }

    if (!active && !withAudio) {
      stop();
      return;
    }

    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setError("La caméra n'est pas disponible sur cet appareil.");
      return;
    }

    navigator.mediaDevices
      .getUserMedia({ video: active, audio: withAudio })
      .then((s) => {
        if (cancelled) {
          s.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = s;
        setStream(s);
        setError(null);
      })
      .catch((e) => {
        if (!cancelled) {
          setError(
            e instanceof DOMException && e.name === "NotAllowedError"
              ? "Accès à la caméra refusé."
              : "Caméra indisponible.",
          );
        }
      });

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, [active, withAudio]);

  // Libere la camera si le composant est demonte camera allumee.
  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  return { stream, error };
}
