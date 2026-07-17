import "server-only";
import type { PanelParticipant } from "@/components/stage/participants-panel";
import type { Poll } from "@/components/stage/poll-panel";
import { hasDatabase, query, queryOne } from "@/lib/db";

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
 * Contenu du mockup, servi tant que la base n'est pas branchee.
 */
function demoWebinar(code: string): Webinar | null {
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

/**
 * Lit un webinaire depuis la base Neon (metadonnees + participants + sondage),
 * ou retombe sur le contenu du mockup en mode demo.
 */
export async function getWebinar(code: string): Promise<Webinar | null> {
  if (!hasDatabase) return demoWebinar(code);

  const webinar = await queryOne<{
    id: string;
    title: string;
    status: string;
    started_at: Date | null;
  }>(
    "SELECT id, title, status, started_at FROM meetings WHERE code = $1 AND kind = 'webinar'",
    [code],
  );
  if (!webinar) return null;

  const participants = await query<{
    id: string;
    display_name: string;
    role: string;
    muted: boolean;
  }>(
    `SELECT id, display_name, role, muted FROM participants
      WHERE meeting_id = $1 ORDER BY joined_at NULLS LAST LIMIT 200`,
    [webinar.id],
  );

  const poll = await queryOne<{ id: string; question: string }>(
    "SELECT id, question FROM polls WHERE meeting_id = $1 AND status = 'open' ORDER BY created_at DESC LIMIT 1",
    [webinar.id],
  );

  let pollData: Poll | null = null;
  if (poll) {
    const opts = await query<{ label: string; votes: number }>(
      "SELECT label, votes FROM poll_options WHERE poll_id = $1 ORDER BY position",
      [poll.id],
    );
    const total = opts.reduce((s, o) => s + o.votes, 0) || 1;
    pollData = {
      question: poll.question,
      options: opts.map((o) => ({
        label: o.label,
        percent: Math.round((o.votes / total) * 100),
      })),
    };
  }

  const elapsed = webinar.started_at
    ? Math.max(0, Math.floor((Date.now() - new Date(webinar.started_at).getTime()) / 1000))
    : 0;

  return {
    code,
    title: webinar.title,
    live: webinar.status === "live",
    participantCount: participants.length || 1,
    startedAt: webinar.started_at ? new Date(webinar.started_at).toISOString() : "",
    elapsedSeconds: elapsed,
    speakerId: participants[0]?.id ?? "p0",
    chatUnread: 0,
    participants: participants.map((p) => ({
      id: p.id,
      name: p.display_name,
      muted: p.muted,
      isHost: p.role === "host",
      isModerator: p.role === "moderator" || p.role === "host",
      isSpeaker: p.role === "speaker" || p.role === "host",
    })),
    poll: pollData,
  };
}
