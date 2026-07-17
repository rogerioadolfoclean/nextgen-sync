import "server-only";
import { AccessToken, RoomServiceClient } from "livekit-server-sdk";

/**
 * Couche serveur LiveKit : generation des jetons d'acces et gestion des salles.
 *
 * Tant que les 3 variables ne sont pas renseignees, `hasLiveKit` vaut false :
 * la salle passe en mode demo (avatars, pas de flux temps reel). Il suffit
 * d'ajouter les cles LiveKit pour activer la vraie visio HD, sans autre change.
 */
const API_KEY = process.env.LIVEKIT_API_KEY;
const API_SECRET = process.env.LIVEKIT_API_SECRET;
const HOST = process.env.LIVEKIT_URL;

export const hasLiveKit = Boolean(API_KEY && API_SECRET && HOST);

export type TokenGrant = {
  room: string;
  identity: string;
  name: string;
  /** Hote/moderateur : peut publier + gerer la salle. */
  canPublish?: boolean;
  /** Salle d'attente : l'invite est admis mais ne publie pas encore. */
  admitted?: boolean;
};

/** Fabrique un jeton d'acces signe pour rejoindre une salle. */
export async function createAccessToken(grant: TokenGrant): Promise<string> {
  if (!hasLiveKit) {
    throw new Error("LiveKit non configuré.");
  }

  const at = new AccessToken(API_KEY, API_SECRET, {
    identity: grant.identity,
    name: grant.name,
    ttl: "2h",
  });

  at.addGrant({
    roomJoin: true,
    room: grant.room,
    canPublish: grant.canPublish ?? true,
    canSubscribe: true,
    canPublishData: true,
  });

  // toJwt() est asynchrone dans le SDK v2.
  return at.toJwt();
}

let roomService: RoomServiceClient | null = null;

function service(): RoomServiceClient {
  if (!hasLiveKit) throw new Error("LiveKit non configuré.");
  if (!roomService) {
    // L'API REST utilise http(s), pas le schema ws(s) du client.
    const httpHost = HOST!.replace(/^ws/, "http");
    roomService = new RoomServiceClient(httpHost, API_KEY!, API_SECRET!);
  }
  return roomService;
}

/** Cree la salle si besoin (idempotent). */
export async function ensureRoom(name: string): Promise<void> {
  if (!hasLiveKit) return;
  try {
    await service().createRoom({ name, emptyTimeout: 300, maxParticipants: 0 });
  } catch {
    // Deja creee : le service renvoie une erreur, sans consequence.
  }
}

/** URL publique du serveur, cote navigateur. */
export function publicUrl(): string | null {
  return process.env.NEXT_PUBLIC_LIVEKIT_URL ?? HOST ?? null;
}
