import "server-only";

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
  when: string;
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

export async function getUpcomingMeetings(
  _userId: string,
): Promise<UpcomingMeeting[]> {
  return [
    { id: "m1", code: "equipe-hebdo", title: "Réunion d'équipe", when: "Aujourd'hui · 10:00 - 11:00" },
    { id: "m2", code: "point-marketing", title: "Point marketing", when: "Aujourd'hui · 14:00 - 15:00" },
    { id: "m3", code: "revue-produit", title: "Revue produit", when: "Demain · 09:30 - 10:30" },
  ];
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
