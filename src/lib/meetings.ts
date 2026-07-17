import "server-only";
import type { ChatMessage } from "@/components/stage/chat-panel";
import { BRAINSTORM_BOARD, type BoardState } from "@/lib/whiteboard";
import { hasDatabase, query, queryOne } from "@/lib/db";

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

/** Contenu du mockup, servi tant que la base n'est pas branchee. */
function demoMeeting(code: string): Meeting | null {
  const known: Record<string, { title: string; elapsed: number }> = {
    "brainstorming-produit": { title: "Brainstorming produit", elapsed: 2142 },
    "equipe-hebdo": { title: "Réunion d'équipe", elapsed: 1458 },
    "point-marketing": { title: "Point marketing", elapsed: 0 },
    "revue-produit": { title: "Revue produit", elapsed: 0 },
    "retro-sprint": { title: "Rétrospective sprint", elapsed: 0 },
  };
  // Une reunion instantanee ou rejointe par code ("nouvelle reunion",
  // "rejoindre") demarre une salle vide plutot qu'un 404.
  const instant = !known[code];
  const found = known[code] ?? { title: "Réunion instantanée", elapsed: 0 };

  return {
    code,
    title: found.title,
    elapsedSeconds: found.elapsed,
    participantCount: instant ? 1 : 12,
    chatUnread: instant ? 0 : 3,
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

/**
 * Lit une reunion depuis la base Neon (metadonnees + participants + chat +
 * tableau blanc), ou retombe sur le contenu du mockup en mode demo.
 */
export async function getMeeting(code: string): Promise<Meeting | null> {
  if (!hasDatabase) return demoMeeting(code);

  const meeting = await queryOne<{
    id: string;
    title: string;
    started_at: Date | null;
  }>(
    "SELECT id, title, started_at FROM meetings WHERE code = $1 AND kind = 'meeting'",
    [code],
  );
  if (!meeting) return null;

  const [participants, messages, board] = await Promise.all([
    query<{ id: string; display_name: string; muted: boolean }>(
      `SELECT id, display_name, muted FROM participants
        WHERE meeting_id = $1 ORDER BY joined_at NULLS LAST LIMIT 12`,
      [meeting.id],
    ),
    query<{ id: string; author_name: string; body: string; created_at: Date }>(
      `SELECT id, author_name, body, created_at FROM messages
        WHERE meeting_id = $1 AND private_to IS NULL
        ORDER BY created_at LIMIT 50`,
      [meeting.id],
    ),
    queryOne<{ state: BoardState }>(
      "SELECT state FROM whiteboards WHERE meeting_id = $1 ORDER BY updated_at DESC LIMIT 1",
      [meeting.id],
    ),
  ]);

  const elapsed = meeting.started_at
    ? Math.max(0, Math.floor((Date.now() - new Date(meeting.started_at).getTime()) / 1000))
    : 0;

  return {
    code,
    title: meeting.title,
    elapsedSeconds: elapsed,
    participantCount: participants.length || 1,
    chatUnread: 0,
    participants: (participants.length
      ? participants
      : [{ id: "self", display_name: "Vous", muted: false }]
    ).map((p) => ({ id: p.id, name: p.display_name, muted: p.muted })),
    messages: messages.map((m) => ({
      id: m.id,
      author: m.author_name,
      time: new Date(m.created_at).toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      text: m.body,
    })),
    board: board?.state ?? BRAINSTORM_BOARD,
  };
}
