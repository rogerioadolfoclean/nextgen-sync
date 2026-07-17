import "server-only";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { hasDatabase, queryOne } from "@/lib/db";

/**
 * Authentification par cookie de session signe (JWT via jose).
 *
 * Sans DATABASE_URL, `signIn` est desactive et l'app tourne avec la persona
 * de demo (voir getSessionUser). Le branchement se fait en ajoutant l'URL Neon
 * et un SESSION_SECRET.
 */

const COOKIE = "ngs_session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 jours

function secret() {
  const s = process.env.SESSION_SECRET;
  if (!s) throw new Error("SESSION_SECRET manquant.");
  return new TextEncoder().encode(s);
}

export type DbUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar_url: string | null;
  plan: string;
};

/** Verifie l'email + mot de passe, puis pose le cookie de session. */
export async function signIn(
  email: string,
  password: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!hasDatabase) {
    return { ok: false, error: "Base de données non configurée." };
  }

  const user = await queryOne<DbUser & { password_hash: string }>(
    "SELECT * FROM users WHERE email = $1",
    [email.toLowerCase().trim()],
  );
  if (!user) return { ok: false, error: "Identifiants invalides." };

  const good = await bcrypt.compare(password, user.password_hash);
  if (!good) return { ok: false, error: "Identifiants invalides." };

  const token = await new SignJWT({ uid: user.id })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(secret());

  const store = await cookies();
  store.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });

  return { ok: true };
}

/** Supprime le cookie de session. */
export async function signOut() {
  const store = await cookies();
  store.delete(COOKIE);
}

/** Utilisateur reel de la session, ou null si non connecte / pas de base. */
export async function getCurrentUser(): Promise<DbUser | null> {
  if (!hasDatabase) return null;

  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret());
    const uid = payload.uid as string;
    return queryOne<DbUser>(
      "SELECT id, name, email, role, avatar_url, plan FROM users WHERE id = $1",
      [uid],
    );
  } catch {
    return null;
  }
}

/** Cree un compte puis ouvre la session. */
export async function register(
  name: string,
  email: string,
  password: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!hasDatabase) {
    return { ok: false, error: "Base de données non configurée." };
  }

  const clean = email.toLowerCase().trim();
  const exists = await queryOne("SELECT id FROM users WHERE email = $1", [clean]);
  if (exists) return { ok: false, error: "Cet email est déjà utilisé." };

  const hash = await bcrypt.hash(password, 12);
  await queryOne(
    `INSERT INTO users (name, email, password_hash, role, plan)
     VALUES ($1, $2, $3, 'member', 'freemium') RETURNING id`,
    [name.trim(), clean, hash],
  );

  return signIn(clean, password);
}
