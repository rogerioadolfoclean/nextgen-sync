export type Accent = "blue" | "green" | "violet" | "orange";

export type StickyNote = {
  id: string;
  x: number;
  y: number;
  w: number;
  title: string;
  bullets: string[];
  accent: Accent;
};

export type Scribble = {
  id: string;
  /** Points bruts du trace a main levee, en coordonnees du plan. */
  points: { x: number; y: number }[];
  color: string;
};

export type BoardState = {
  notes: StickyNote[];
  scribbles: Scribble[];
  center: { x: number; y: number; label: string };
  caption: { x: number; y: number; text: string } | null;
};

/** Couleurs des cartes, alignees sur les accents du mockup. */
export const ACCENTS: Record<Accent, { border: string; text: string; tint: string }> = {
  blue: { border: "#3b6cf8", text: "#2b56d4", tint: "#f2f6ff" },
  green: { border: "#41c069", text: "#2f9a51", tint: "#f1fbf4" },
  violet: { border: "#6f5ad9", text: "#5b46bf", tint: "#f6f4fe" },
  orange: { border: "#f79a2b", text: "#c9751a", tint: "#fff8ef" },
};

/**
 * Contenu du tableau blanc tel qu'il apparait dans le mockup
 * ("Brainstorming produit"). Sert d'etat initial de la salle.
 */
export const BRAINSTORM_BOARD: BoardState = {
  center: { x: 500, y: 300, label: "Idée principale" },
  caption: { x: 360, y: 415, text: "Lancement" },
  scribbles: [],
  notes: [
    {
      id: "n1",
      x: 120,
      y: 120,
      w: 200,
      accent: "blue",
      title: "Recherche utilisateurs",
      bullets: ["Interviews", "Sondages", "Analyse"],
    },
    {
      id: "n2",
      x: 680,
      y: 120,
      w: 200,
      accent: "green",
      title: "Fonctionnalités clés",
      bullets: ["Visioconférence", "Tableau blanc", "Transcription IA"],
    },
    {
      id: "n3",
      x: 120,
      y: 400,
      w: 200,
      accent: "violet",
      title: "Expérience utilisateur",
      bullets: ["Simplicité", "Accessibilité", "Performance"],
    },
    {
      id: "n4",
      x: 680,
      y: 400,
      w: 200,
      accent: "orange",
      title: "Monétisation",
      bullets: ["Freemium", "Abonnement", "Enterprise"],
    },
  ],
};
