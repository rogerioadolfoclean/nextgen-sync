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
