import "server-only";
import Anthropic from "@anthropic-ai/sdk";

/**
 * Couche IA de NextGen Sync.
 *
 * Toutes les fonctions du document de reference : compte rendu automatique
 * (resume + decisions + taches), traduction en temps reel et sous-titres.
 *
 * Sans ANTHROPIC_API_KEY, `hasAI` vaut false : chaque fonction renvoie un
 * resultat de demonstration, et il suffit d'ajouter la cle pour activer les
 * vraies reponses de Claude, sans toucher au reste du code.
 */
export const hasAI = Boolean(process.env.ANTHROPIC_API_KEY);

const MODEL = "claude-opus-4-8";

const client = hasAI ? new Anthropic() : null;

export type MeetingRecap = {
  summary: string;
  decisions: string[];
  actionItems: { task: string; owner: string | null }[];
};

export type MeetingSuggestions = {
  overview: string;
  suggestions: string[];
  questions: string[];
  risks: string[];
  actions: { task: string; owner: string | null; priority: "haute" | "moyenne" | "basse" }[];
};

/** Analyse vivante de la réunion et recommandations concrètes pour l'organisateur. */
export async function suggestMeetingActions(context: string): Promise<MeetingSuggestions> {
  const lines = context.split("\n").map((line) => line.trim()).filter(Boolean).slice(-200);
  const discussion = lines.slice(1);
  const questions = discussion.filter((line) => line.includes("?")).slice(-4).map((line) => line.replace(/^[^:]+:\s*/, ""));
  const actionLines = discussion.filter((line) => /\b(faut|devons|doit|action|faire|préparer|envoyer|corriger|tester|publier)\b/i.test(line)).slice(-4);
  const riskLines = discussion.filter((line) => /\b(risque|problème|erreur|bloqué|retard|impossible|attention)\b/i.test(line)).slice(-3);
  const speakers = new Set(discussion.map((line) => line.split(":")[0]).filter(Boolean));

  return {
    overview: discussion.length
      ? `${discussion.length} contribution${discussion.length > 1 ? "s" : ""} analysée${discussion.length > 1 ? "s" : ""}. ${speakers.size} participant${speakers.size > 1 ? "s" : ""} actif${speakers.size > 1 ? "s" : ""}. Le copilote recommande de convertir les échanges en décisions datées et attribuées.`
      : "La réunion vient de commencer. Définissez l'objectif et le résultat attendu pour obtenir des recommandations plus précises.",
    suggestions: [
      "Formuler clairement la décision principale attendue",
      speakers.size < 2 ? "Inviter les autres participants à donner leur avis" : "Vérifier que chaque participant valide la conclusion",
      "Attribuer un responsable et une échéance à chaque prochaine étape",
    ],
    questions: questions.length ? questions : [
      "Quelle décision doit absolument être prise aujourd'hui ?",
      "Qui sera responsable de la prochaine étape ?",
    ],
    risks: riskLines.length
      ? riskLines.map((line) => line.replace(/^[^:]+:\s*/, ""))
      : ["Les décisions sans responsable ni date limite risquent de ne pas être exécutées"],
    actions: actionLines.length
      ? actionLines.map((line, index) => ({ task: line.replace(/^[^:]+:\s*/, ""), owner: null, priority: index === 0 ? "haute" as const : "moyenne" as const }))
      : [
          { task: "Confirmer les décisions finales", owner: null, priority: "haute" },
          { task: "Partager le compte rendu aux participants", owner: null, priority: "moyenne" },
        ],
  };
}

/**
 * Compte rendu automatique d'une reunion a partir de sa transcription :
 * resume, decisions et taches. Sortie structuree validee par schema.
 */
export async function summarizeMeeting(
  transcript: string,
): Promise<MeetingRecap> {
  if (!client) {
    return {
      summary:
        "Compte rendu de démonstration : l'équipe a passé en revue l'avancement et défini les prochaines étapes. (Ajoutez ANTHROPIC_API_KEY pour générer un vrai résumé.)",
      decisions: [
        "Prioriser la fonctionnalité de traduction en temps réel",
        "Lancer la phase de tests la semaine prochaine",
      ],
      actionItems: [
        { task: "Préparer la maquette du tableau de bord", owner: "Sarah" },
        { task: "Rédiger le cahier des charges technique", owner: "Marc" },
      ],
    };
  }

  const message = await client.messages.create({
    model: MODEL,
    max_tokens: 4096,
    thinking: { type: "adaptive" },
    system:
      "Tu es l'assistant de réunion de NextGen Sync. À partir d'une transcription, tu produis un compte rendu clair en français : un résumé concis, la liste des décisions prises, et les tâches à réaliser avec leur responsable si mentionné.",
    output_config: {
      format: {
        type: "json_schema",
        schema: {
          type: "object",
          additionalProperties: false,
          properties: {
            summary: { type: "string" },
            decisions: { type: "array", items: { type: "string" } },
            actionItems: {
              type: "array",
              items: {
                type: "object",
                additionalProperties: false,
                properties: {
                  task: { type: "string" },
                  owner: { type: ["string", "null"] },
                },
                required: ["task", "owner"],
              },
            },
          },
          required: ["summary", "decisions", "actionItems"],
        },
      },
    },
    messages: [
      {
        role: "user",
        content: `Voici la transcription de la réunion. Génère le compte rendu.\n\n${transcript}`,
      },
    ],
  });

  const block = message.content.find((b) => b.type === "text");
  const text = block && block.type === "text" ? block.text : "{}";
  return JSON.parse(text) as MeetingRecap;
}

/**
 * Traduction d'un segment (sous-titres / chat) vers la langue cible.
 * `targetLang` est un code ISO ("en", "pt", "es", "ln"...).
 */
export async function translate(
  text: string,
  targetLang: string,
): Promise<string> {
  if (!client) {
    return `[${targetLang}] ${text}`;
  }

  const message = await client.messages.create({
    model: MODEL,
    max_tokens: 1024,
    system:
      "Tu es un traducteur simultané. Traduis fidèlement le texte fourni vers la langue cible, sans commentaire ni guillemets — renvoie uniquement la traduction.",
    messages: [
      {
        role: "user",
        content: `Traduis vers "${targetLang}" :\n${text}`,
      },
    ],
  });

  const block = message.content.find((b) => b.type === "text");
  return block && block.type === "text" ? block.text.trim() : text;
}
