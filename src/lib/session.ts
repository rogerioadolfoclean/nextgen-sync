import "server-only";
import { getCurrentUser } from "@/lib/auth";
import { hasDatabase, query } from "@/lib/db";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl: string | null;
  unreadCount: number;
};

/** Persona du mockup, servie tant que la base n'est pas branchee. */
const DEMO_USER: SessionUser = {
  id: "demo-sarah",
  name: "Sarah Dupont",
  email: "sarah.dupont@nextgensync.app",
  role: "Admin",
  avatarUrl: null,
  unreadCount: 1,
};

/**
 * Utilisateur de la session courante.
 *
 * Avec la base : lit le cookie de session, et retombe sur la persona demo si
 * personne n'est connecte (l'app reste navigable sans page de login). Sans la
 * base : toujours la persona demo, conforme au mockup.
 */
export async function getSessionUser(): Promise<SessionUser> {
  if (!hasDatabase) return DEMO_USER;

  const user = await getCurrentUser();
  if (!user) return DEMO_USER;

  const rows = await query<{ n: string }>(
    "SELECT COUNT(*)::text AS n FROM video_messages WHERE recipient_id = $1 AND seen = false",
    [user.id],
  );
  const unread = Number(rows[0]?.n ?? 0);

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role === "admin" ? "Admin" : user.role === "host" ? "Hôte" : "Membre",
    avatarUrl: user.avatar_url,
    unreadCount: unread,
  };
}
