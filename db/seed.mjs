/**
 * Remplit la base avec les donnees du mockup + le compte admin.
 * Idempotent : reexecutable sans creer de doublons (ON CONFLICT).
 *
 * Usage : npm run db:seed
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";
import bcrypt from "bcryptjs";

const here = dirname(fileURLToPath(import.meta.url));

const url = process.env.DATABASE_URL ?? lireEnv();
function lireEnv() {
  for (const f of [".env.local", ".env"]) {
    try {
      const txt = readFileSync(join(here, "..", f), "utf8");
      const m = txt.match(/^DATABASE_URL\s*=\s*"?([^"\n\r]+)"?/m);
      if (m) return m[1].trim();
    } catch {
      /* suivant */
    }
  }
  throw new Error("DATABASE_URL introuvable (.env.local ou .env)");
}

const client = new pg.Client({
  connectionString: url,
  ssl: { rejectUnauthorized: false },
});
await client.connect();

// ---------- Compte administrateur (regle projet) ----------
const adminEmail = "rogerioadolfoclean@gmail.com";
const adminPass = process.env.ADMIN_PASSWORD ?? "NextGen@2026";
const adminHash = await bcrypt.hash(adminPass, 12);

const { rows: adminRows } = await client.query(
  `INSERT INTO users (name, email, password_hash, role, plan)
   VALUES ($1, $2, $3, 'admin', 'enterprise')
   ON CONFLICT (email) DO UPDATE
     SET role = 'admin', plan = 'enterprise'
   RETURNING id`,
  ["Rogerio Adolfo", adminEmail, adminHash],
);
const adminId = adminRows[0].id;
console.log(`✓ admin ${adminEmail}`);

// ---------- Persona de demo (Sarah, celle du mockup) ----------
const sarahHash = await bcrypt.hash("Demo@2026", 12);
const { rows: sarahRows } = await client.query(
  `INSERT INTO users (name, email, password_hash, role, plan)
   VALUES ($1, $2, $3, 'host', 'pro')
   ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
   RETURNING id`,
  ["Sarah Dupont", "sarah.dupont@nextgensync.app", sarahHash],
);
const sarahId = sarahRows[0].id;
console.log("✓ demo Sarah Dupont");

// ---------- Reunions du mockup ----------
const meetings = [
  ["equipe-hebdo", "Réunion d'équipe", "meeting", "scheduled"],
  ["point-marketing", "Point marketing", "meeting", "scheduled"],
  ["revue-produit", "Revue produit", "meeting", "scheduled"],
  ["retro-sprint", "Rétrospective sprint", "meeting", "scheduled"],
  ["brainstorming-produit", "Brainstorming produit", "meeting", "live"],
  ["avenir-du-travail", "Webinaire : L'avenir du travail", "webinar", "live"],
];
for (const [code, title, kind, status] of meetings) {
  await client.query(
    `INSERT INTO meetings (code, title, host_id, kind, status)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (code) DO UPDATE SET title = EXCLUDED.title`,
    [code, title, sarahId, kind, status],
  );
}
console.log(`✓ ${meetings.length} reunions`);

// ---------- Enregistrements recents ----------
const recordings = [
  ["Présentation Q1", 2712],
  ["Formation produit", 4353],
  ["Webinaire : IA & Collaboration", 3490],
];
for (const [title, dur] of recordings) {
  await client.query(
    `INSERT INTO recordings (owner_id, title, duration_s)
     SELECT $1, $2, $3
     WHERE NOT EXISTS (
       SELECT 1 FROM recordings WHERE owner_id = $1 AND title = $2
     )`,
    [sarahId, title, dur],
  );
}
console.log(`✓ ${recordings.length} enregistrements`);

// ---------- Sondage du webinaire ----------
const { rows: web } = await client.query(
  "SELECT id FROM meetings WHERE code = 'avenir-du-travail'",
);
if (web[0]) {
  const { rows: existing } = await client.query(
    "SELECT id FROM polls WHERE meeting_id = $1",
    [web[0].id],
  );
  if (existing.length === 0) {
    const { rows: poll } = await client.query(
      `INSERT INTO polls (meeting_id, question, status)
       VALUES ($1, $2, 'open') RETURNING id`,
      [web[0].id, "Q1. Comment évaluez-vous cette session ?"],
    );
    const opts = [
      ["Excellent", 72, 0],
      ["Bon", 20, 1],
      ["Moyen", 6, 2],
      ["Mauvais", 2, 3],
    ];
    for (const [label, votes, pos] of opts) {
      await client.query(
        `INSERT INTO poll_options (poll_id, label, votes, position)
         VALUES ($1, $2, $3, $4)`,
        [poll[0].id, label, votes, pos],
      );
    }
    console.log("✓ sondage webinaire");
  }
}

// ---------- Message video pour Sarah ----------
await client.query(
  `INSERT INTO video_messages (recipient_id, sender_name, duration_s, seen)
   SELECT $1, 'Thomas Martin', 120, false
   WHERE NOT EXISTS (
     SELECT 1 FROM video_messages WHERE recipient_id = $1 AND sender_name = 'Thomas Martin'
   )`,
  [sarahId],
);
console.log("✓ message video");

console.log("\nSeed termine.");
console.log(`Admin : ${adminEmail} / ${adminPass}`);
await client.end();
