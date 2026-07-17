import "server-only";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl: string | null;
  unreadCount: number;
};

/**
 * Utilisateur de la session courante.
 *
 * TODO(auth) : branchement sur la table `users` de Neon + cookie de session.
 * En attendant, renvoie le profil du mockup pour que l'interface soit rendue
 * telle quelle. Remplace par la vraie lecture de session a l'etape 6.
 */
export async function getSessionUser(): Promise<SessionUser> {
  return {
    id: "demo-sarah",
    name: "Sarah Dupont",
    email: "sarah.dupont@nextgensync.app",
    role: "Admin",
    avatarUrl: null,
    unreadCount: 1,
  };
}
