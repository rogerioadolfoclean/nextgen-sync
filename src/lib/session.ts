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

  let user = await getCurrentUser();

  // Pas de session connectée : on utilise le compte vitrine (premier compte réel,
  // créé au seed), qui possède le contenu de démonstration. Son id est un vrai
  // UUID — indispensable pour les requêtes SQL suivantes (contrairement à la
  // persona factice « demo-sarah »).
  if (!user) {
    const vitrine = await query<{
      id: string;
      name: string;
      email: string;
      role: string;
      avatar_url: string | null;
    }>(
      "SELECT id, name, email, role, avatar_url FROM users ORDER BY created_at LIMIT 1",
    );
    user = vitrine[0] ?? null;
  }
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
