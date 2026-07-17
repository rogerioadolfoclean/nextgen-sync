import "server-only";
import type { Accent } from "@/lib/whiteboard";
import { hasDatabase, query } from "@/lib/db";

/**
 * Couche de lecture du dashboard.
 *
 * Chaque fonction lit la base Neon quand DATABASE_URL est configuree, et
 * retombe sinon sur le contenu du mockup (mode demo). Le branchement se fait
 * donc sans toucher aux pages.
 */

export type UpcomingMeeting = {
  id: string;
  code: string;
  title: string;
  /** Libelle long du dashboard PC : "Aujourd'hui · 10:00 - 11:00". */
  when: string;
  /** Libelle court du mobile : "Aujourd'hui · 10:00". */
  whenShort: string;
  accent: Accent;
};

export type Recording = {
  id: string;
  title: string;
  recordedOn: string;
  duration: string;
};

export type VideoMessage = {
  id: string;
  senderName: string;
  senderAvatar: string | null;
  duration: string;
  sentOn: string;
  unread: number;
};

const ACCENT_CYCLE: Accent[] = ["blue", "green", "orange", "violet"];

/**
 * Un seul calendrier alimente les deux surfaces : le dashboard PC en montre
 * 3 (il a un "Voir tout"), le mobile les 4 (il a "Voir tout le calendrier").
 * Les horaires sont ceux des deux ecrans du mockup, qui concordent.
 */
const DEMO_MEETINGS: UpcomingMeeting[] = [
  { id: "m1", code: "equipe-hebdo", title: "Réunion d'équipe", when: "Aujourd'hui · 10:00 - 11:00", whenShort: "Aujourd'hui · 10:00", accent: "blue" },
  { id: "m2", code: "point-marketing", title: "Point marketing", when: "Aujourd'hui · 14:00 - 15:00", whenShort: "Aujourd'hui · 14:00", accent: "green" },
  { id: "m3", code: "revue-produit", title: "Revue produit", when: "Demain · 09:30 - 10:30", whenShort: "Demain · 09:30", accent: "orange" },
  { id: "m4", code: "retro-sprint", title: "Rétrospective sprint", when: "Vendredi · 11:00 - 12:00", whenShort: "Vendredi · 11:00", accent: "violet" },
];

function formatDuration(totalSeconds: number) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}

export async function getUpcomingMeetings(
  userId: string,
  limit = DEMO_MEETINGS.length,
): Promise<UpcomingMeeting[]> {
  if (!hasDatabase) return DEMO_MEETINGS.slice(0, limit);

  const rows = await query<{
    id: string;
    code: string;
    title: string;
    scheduled_at: Date | null;
  }>(
    `SELECT id, code, title, scheduled_at
       FROM meetings
      WHERE kind = 'meeting' AND status <> 'ended'
      ORDER BY COALESCE(scheduled_at, created_at)
      LIMIT $1`,
    [limit],
  );

  return rows.map((r, i) => {
    const when = r.scheduled_at
      ? new Date(r.scheduled_at).toLocaleString("fr-FR", {
          weekday: "long",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "À planifier";
    return {
      id: r.id,
      code: r.code,
      title: r.title,
      when,
      whenShort: when,
      accent: ACCENT_CYCLE[i % ACCENT_CYCLE.length],
    };
  });
}

export async function getRecentRecordings(userId: string): Promise<Recording[]> {
  if (!hasDatabase) {
    return [
      { id: "r1", title: "Présentation Q1", recordedOn: "28 Avr 2025", duration: "45:12" },
      { id: "r2", title: "Formation produit", recordedOn: "25 Avr 2025", duration: "1:12:33" },
      { id: "r3", title: "Webinaire : IA & Collaboration", recordedOn: "22 Avr 2025", duration: "58:10" },
    ];
  }

  const rows = await query<{
    id: string;
    title: string;
    duration_s: number;
    recorded_at: Date;
  }>(
    `SELECT id, title, duration_s, recorded_at
       FROM recordings
      WHERE owner_id = $1
      ORDER BY recorded_at DESC
      LIMIT 6`,
    [userId],
  );

  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    recordedOn: new Date(r.recorded_at).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    duration: formatDuration(r.duration_s),
  }));
}

export async function getVideoMessages(userId: string): Promise<VideoMessage[]> {
  if (!hasDatabase) {
    return [
      { id: "v1", senderName: "Thomas Martin", senderAvatar: null, duration: "2 min", sentOn: "Aujourd'hui", unread: 1 },
    ];
  }

  const rows = await query<{
    id: string;
    sender_name: string;
    duration_s: number;
    created_at: Date;
    seen: boolean;
  }>(
    `SELECT id, sender_name, duration_s, created_at, seen
       FROM video_messages
      WHERE recipient_id = $1
      ORDER BY created_at DESC
      LIMIT 6`,
    [userId],
  );

  return rows.map((r) => ({
    id: r.id,
    senderName: r.sender_name,
    senderAvatar: null,
    duration: `${Math.round(r.duration_s / 60)} min`,
    sentOn: new Date(r.created_at).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
    }),
    unread: r.seen ? 0 : 1,
  }));
}
