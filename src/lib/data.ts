import "server-only";
import type { Accent } from "@/lib/whiteboard";

/**
 * Couche de lecture du dashboard.
 *
 * TODO(db) : ces fonctions liront les tables Neon (`meetings`, `recordings`,
 * `video_messages`) a l'etape 6. Le contenu ci-dessous est celui du mockup de
 * reference, pour valider le rendu ecran par ecran avant le branchement.
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

/**
 * Un seul calendrier alimente les deux surfaces : le dashboard PC en montre
 * 3 (il a un "Voir tout"), le mobile les 4 (il a "Voir tout le calendrier").
 * Les horaires sont ceux des deux ecrans du mockup, qui concordent.
 */
const MEETINGS: UpcomingMeeting[] = [
  { id: "m1", code: "equipe-hebdo", title: "Réunion d'équipe", when: "Aujourd'hui · 10:00 - 11:00", whenShort: "Aujourd'hui · 10:00", accent: "blue" },
  { id: "m2", code: "point-marketing", title: "Point marketing", when: "Aujourd'hui · 14:00 - 15:00", whenShort: "Aujourd'hui · 14:00", accent: "green" },
  { id: "m3", code: "revue-produit", title: "Revue produit", when: "Demain · 09:30 - 10:30", whenShort: "Demain · 09:30", accent: "orange" },
  { id: "m4", code: "retro-sprint", title: "Rétrospective sprint", when: "Vendredi · 11:00 - 12:00", whenShort: "Vendredi · 11:00", accent: "violet" },
];

export async function getUpcomingMeetings(
  _userId: string,
  limit = MEETINGS.length,
): Promise<UpcomingMeeting[]> {
  return MEETINGS.slice(0, limit);
}

export async function getRecentRecordings(_userId: string): Promise<Recording[]> {
  return [
    { id: "r1", title: "Présentation Q1", recordedOn: "28 Avr 2025", duration: "45:12" },
    { id: "r2", title: "Formation produit", recordedOn: "25 Avr 2025", duration: "1:12:33" },
    { id: "r3", title: "Webinaire : IA & Collaboration", recordedOn: "22 Avr 2025", duration: "58:10" },
  ];
}

export async function getVideoMessages(_userId: string): Promise<VideoMessage[]> {
  return [
    { id: "v1", senderName: "Thomas Martin", senderAvatar: null, duration: "2 min", sentOn: "Aujourd'hui", unread: 1 },
  ];
}
