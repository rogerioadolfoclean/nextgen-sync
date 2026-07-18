/**
 * Les 3 plans du tableau blanc du mockup (carte "Monétisation") :
 * Freemium, Abonnement (Pro), Enterprise.
 *
 * Partage client/serveur : la page de tarifs et le checkout lisent la meme
 * source, pour que catalogue et affichage restent alignes.
 */
export type PlanId = "freemium" | "pro" | "enterprise";

export type Plan = {
  id: PlanId;
  name: string;
  price: number; // en euros / mois
  tagline: string;
  features: string[];
  highlighted?: boolean;
};

export const PLANS: Plan[] = [
  {
    id: "freemium",
    name: "Freemium",
    price: 0,
    tagline: "Pour découvrir la plateforme.",
    features: [
      "Réunions jusqu'à 40 minutes",
      "Jusqu'à 100 participants par réunion",
      "Tableau blanc collaboratif",
      "Chat intégré",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 8,
    tagline: "Pour les équipes qui collaborent au quotidien.",
    highlighted: true,
    features: [
      "Réunions illimitées",
      "Jusqu'à 300 participants par réunion",
      "Sous-titres & traduction IA",
      "Enregistrements dans le cloud",
      "Sondages & analytique",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 19.99,
    tagline: "Sécurité et échelle pour l'organisation.",
    features: [
      "Jusqu'à 1 000 participants par réunion",
      "Webinaires & salles de sous-groupes",
      "Compte rendu IA automatique",
      "Chiffrement E2E, RGPD / HIPAA",
      "SSO & support dédié",
    ],
  },
];

export function planById(id: string): Plan | undefined {
  return PLANS.find((p) => p.id === id);
}
