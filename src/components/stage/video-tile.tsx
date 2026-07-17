"use client";

import { useEffect, useRef } from "react";
import { MicOff, Pin } from "lucide-react";
import { Avatar } from "@/components/avatar";

export type TileParticipant = {
  id: string;
  name: string;
  avatarUrl?: string | null;
  muted?: boolean;
  speaking?: boolean;
  /** Piste video temps reel. Absente = camera coupee, on retombe sur l'avatar. */
  stream?: MediaStream | null;
};

/**
 * Vignette d'un participant : sa video si la camera est active, son avatar
 * sinon. Le nom est incruste en bas a gauche, comme dans le mockup.
 */
export function VideoTile({
  participant,
  className = "",
  showName = true,
  rounded = "rounded-lg",
  nameSize = "text-[10px]",
  avatarSize = 44,
  mirror = false,
}: {
  participant: TileParticipant;
  className?: string;
  showName?: boolean;
  rounded?: string;
  nameSize?: string;
  avatarSize?: number;
  mirror?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { name, avatarUrl, muted, speaking, stream } = participant;

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    // srcObject ne peut pas etre pose en JSX : il faut l'affecter sur le noeud.
    el.srcObject = stream ?? null;
    return () => {
      el.srcObject = null;
    };
  }, [stream]);

  return (
    <div
      className={`relative overflow-hidden bg-tile ${rounded} ${
        speaking ? "ring-2 ring-accent-green" : ""
      } ${className}`}
    >
      {stream ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`size-full object-cover ${mirror ? "-scale-x-100" : ""}`}
        />
      ) : (
        <div className="grid size-full place-items-center">
          <Avatar name={name} src={avatarUrl} size={avatarSize} />
        </div>
      )}

      {showName && (
        <span
          className={`absolute bottom-1.5 left-1.5 flex items-center gap-1 rounded bg-black/55 px-1.5 py-0.5 font-medium text-white backdrop-blur-sm ${nameSize}`}
        >
          {muted && <MicOff size={9} className="text-danger" />}
          {name}
        </span>
      )}
    </div>
  );
}

/** Etiquette "epingle" du grand cadre orateur. */
export function PinnedBadge({ label }: { label: string }) {
  return (
    <span className="absolute top-2 left-2 flex items-center gap-1 rounded bg-black/55 px-2 py-1 text-[10px] font-medium text-white backdrop-blur-sm">
      <Pin size={10} />
      {label}
    </span>
  );
}
