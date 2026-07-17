import "server-only";
import type { PanelParticipant } from "@/components/stage/participants-panel";
import type { Poll } from "@/components/stage/poll-panel";

export type Webinar = {
  code: string;
  title: string;
  live: boolean;
  participantCount: number;
  startedAt: string;
  /** Secondes ecoulees depuis le debut, pour amorcer le chrono cote client. */
  elapsedSeconds: number;
  speakerId: string;
  participants: PanelParticipant[];
  poll: Poll | null;
  chatUnread: number;
};

/**
 * TODO(db) : lecture des tables `webinars` / `webinar_participants` / `polls`.
 * Contenu du mockup en attendant, pour valider le rendu.
 */
export async function getWebinar(code: string): Promise<Webinar | null> {
  if (code !== "avenir-du-travail") return null;

  return {
    code,
    title: "Webinaire : L'avenir du travail",
    live: true,
    participantCount: 786,
    startedAt: "2026-07-17T09:00:00Z",
    elapsedSeconds: 5025, // 01:23:45
    speakerId: "p0",
    chatUnread: 3,
    participants: [
      { id: "p1", name: "Sarah Dupont", muted: false, isHost: true, isSelf: true, isModerator: true, isSpeaker: true, sharing: true },
      { id: "p2", name: "Chloé Bernard", muted: true, isSpeaker: true },
      { id: "p3", name: "David Leroy", muted: true, isSpeaker: true, isModerator: true },
      { id: "p4", name: "Amina K.", muted: true, isSpeaker: true },
      { id: "p5", name: "Lucas Morel", muted: true, isModerator: true },
      { id: "p6", name: "Nadia Cherif", muted: true },
      { id: "p7", name: "Marc Olivier", muted: true },
    ],
    poll: {
      question: "Q1. Comment évaluez-vous cette session ?",
      options: [
        { label: "Excellent", percent: 72 },
        { label: "Bon", percent: 20 },
        { label: "Moyen", percent: 6 },
        { label: "Mauvais", percent: 2 },
      ],
    },
  };
}
