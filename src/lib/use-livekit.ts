"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Room,
  RoomEvent,
  Track,
  type RemoteTrack,
  type RemoteParticipant,
  type LocalTrackPublication,
} from "livekit-client";

export type RemoteFeed = {
  identity: string;
  name: string;
  stream: MediaStream;
};

export type LiveKitState = {
  /** false = pas de cles serveur : la salle reste en mode demo (avatars). */
  enabled: boolean;
  connected: boolean;
  connecting: boolean;
  error: string | null;
  localStream: MediaStream | null;
  remotes: RemoteFeed[];
  micOn: boolean;
  camOn: boolean;
  sharing: boolean;
  toggleMic: () => void;
  toggleCam: () => void;
  toggleShare: () => void;
};

/**
 * Connecte le navigateur a une salle LiveKit et expose les flux temps reel.
 *
 * Sans cles serveur, `/api/livekit/token` renvoie { enabled:false } : le hook
 * s'arrete la et les composants gardent leur rendu demo (avatars). Il suffit
 * d'ajouter les cles LiveKit pour que la vraie video HD s'active.
 */
export function useLiveKit(roomCode: string, role: string, displayName?: string, participantId?: string): LiveKitState {
  const roomRef = useRef<Room | null>(null);
  const [enabled, setEnabled] = useState(false);
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remotes, setRemotes] = useState<RemoteFeed[]>([]);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [sharing, setSharing] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const room = new Room({ adaptiveStream: true, dynacast: true });
    roomRef.current = room;

    const refreshRemotes = () => {
      const feeds: RemoteFeed[] = [];
      room.remoteParticipants.forEach((p: RemoteParticipant) => {
        const stream = new MediaStream();
        let hasTrack = false;
        p.trackPublications.forEach((pub) => {
          if (pub.track && pub.isSubscribed) {
            stream.addTrack(pub.track.mediaStreamTrack);
            hasTrack = true;
          }
        });
        if (hasTrack) {
          feeds.push({
            identity: p.identity,
            name: p.name || p.identity,
            stream,
          });
        }
      });
      setRemotes(feeds);
    };

    room
      .on(RoomEvent.Connected, () => !cancelled && setConnected(true))
      .on(RoomEvent.Disconnected, () => !cancelled && setConnected(false))
      .on(RoomEvent.TrackSubscribed, (_t: RemoteTrack) => refreshRemotes())
      .on(RoomEvent.TrackUnsubscribed, () => refreshRemotes())
      .on(RoomEvent.ParticipantConnected, () => refreshRemotes())
      .on(RoomEvent.ParticipantDisconnected, () => refreshRemotes())
      .on(RoomEvent.LocalTrackPublished, (pub: LocalTrackPublication) => {
        if (pub.track?.kind === Track.Kind.Video) {
          setLocalStream(new MediaStream([pub.track.mediaStreamTrack]));
        }
      });

    async function connect() {
      setConnecting(true);
      try {
        const res = await fetch(
          `/api/livekit/token?room=${encodeURIComponent(roomCode)}&role=${encodeURIComponent(role)}&name=${encodeURIComponent(displayName ?? "")}&participantId=${encodeURIComponent(participantId ?? "")}`,
        );
        const data = await res.json();
        if (cancelled) return;

        if (!data.enabled) {
          setEnabled(false);
          setConnecting(false);
          return;
        }
        setEnabled(true);

        await room.connect(data.url, data.token);
        if (cancelled) {
          await room.disconnect();
          return;
        }

        const canPublish =
          role === "host" || role === "moderator" || role === "speaker";
        if (canPublish) {
          await room.localParticipant.setCameraEnabled(true);
          await room.localParticipant.setMicrophoneEnabled(true);
        }
        refreshRemotes();
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Connexion impossible.");
        }
      } finally {
        if (!cancelled) setConnecting(false);
      }
    }

    connect();

    return () => {
      cancelled = true;
      room.disconnect();
      roomRef.current = null;
    };
  }, [roomCode, role, displayName, participantId]);

  const toggleMic = useCallback(() => {
    const room = roomRef.current;
    setMicOn((on) => {
      room?.localParticipant.setMicrophoneEnabled(!on);
      return !on;
    });
  }, []);

  const toggleCam = useCallback(() => {
    const room = roomRef.current;
    setCamOn((on) => {
      room?.localParticipant.setCameraEnabled(!on);
      return !on;
    });
  }, []);

  const toggleShare = useCallback(() => {
    const room = roomRef.current;
    setSharing((on) => {
      room?.localParticipant.setScreenShareEnabled(!on);
      return !on;
    });
  }, []);

  return {
    enabled,
    connected,
    connecting,
    error,
    localStream,
    remotes,
    micOn,
    camOn,
    sharing,
    toggleMic,
    toggleCam,
    toggleShare,
  };
}
