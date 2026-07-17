import { redirect } from "next/navigation";

// Un code neuf doit etre genere a chaque visite : sinon la page prerendue
// figerait la meme salle au build.
export const dynamic = "force-dynamic";

/**
 * "Nouvelle réunion" : genere un code unique et ouvre la salle directement.
 * (Cote base, cette route creera aussi la ligne `meetings` quand DATABASE_URL
 * sera branchee ; pour l'instant elle ouvre une salle instantanee.)
 */
export default function NouvelleReunionPage() {
  const code = `instantanee-${Math.random().toString(36).slice(2, 8)}`;
  redirect(`/reunion/${code}`);
}
