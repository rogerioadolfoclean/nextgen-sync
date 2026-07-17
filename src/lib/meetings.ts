import "server-only";
import type { ChatMessage } from "@/components/stage/chat-panel";
import { BRAINSTORM_BOARD, type BoardState } from "@/lib/whiteboard";

export type MeetingParticipant = {
  id: string;
  name: string;
  avatarUrl?: string | null;
  muted: boolean;
};

export type Meeting = {
  code: string;
  title: string;
  elapsedSeconds: number;
  participantCount: number;
  chatUnread: number;
  participants: MeetingParticipant[];
  messages: ChatMessage[];
  board: BoardState;
};

/**
 * TODO(db) : lecture des tables `meetings` / `participants` / `messages` /
 * `whiteboards`. Contenu du mockup en attendant.
 */
export async function getMeeting(code: string): Promise<Meeting | null> {
  const known: Record<string, { title: string; elapsed: number }> = {
    "brainstorming-produit": { title: "Brainstorming produit", elapsed: 2142 },
    "equipe-hebdo": { title: "Réunion d'équipe", elapsed: 1458 },
    "point-marketing": { title: "Point marketing", elapsed: 0 },
    "revue-produit": { title: "Revue produit", elapsed: 0 },
  };
  const found = known[code];
  if (!found) return null;

  return {
    code,
    title: found.title,
    elapsedSeconds: found.elapsed,
    participantCount: 12,
    chatUnread: 3,
    participants: [
      { id: "u1", name: "Sarah", muted: false },
      { id: "u2", name: "Marc", muted: false },
      { id: "u3", name: "Julie", muted: false },
      { id: "u4", name: "Thomas", muted: false },
      { id: "u5", name: "Léa", muted: false },
    ],
    messages: [
      { id: "c1", author: "Marc", time: "10:15", text: "Très bonne idée !" },
      { id: "c2", author: "Julie", time: "10:16", text: "Je suis d'accord pour la fonctionnalité IA 👍" },
      { id: "c3", author: "Thomas", time: "10:17", text: "On peut ajouter la traduction en temps réel." },
      { id: "c4", author: "Léa", time: "10:18", text: "Excellente suggestion !" },
    ],
    board: BRAINSTORM_BOARD,
  };
}
