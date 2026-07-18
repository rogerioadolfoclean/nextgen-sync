import Link from "next/link";
import { Logo } from "@/components/logo";

export const metadata = {
  title: "API Développeurs — NextGen Sync",
  description:
    "API REST publique de NextGen Sync : créez des réunions, listez les enregistrements et les webinaires par programmation.",
};

type Endpoint = {
  method: "GET" | "POST";
  path: string;
  desc: string;
  example: string;
};

const BASE = "https://nextgen-sync-devaryx-kernel.vercel.app";

const ENDPOINTS: Endpoint[] = [
  {
    method: "POST",
    path: "/api/v1/meetings",
    desc: "Créer une réunion ou un webinaire. Renvoie le code et le lien d'accès (join_url).",
    example: `curl -X POST ${BASE}/api/v1/meetings \\
  -H "Authorization: Bearer ngs_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{ "title": "Réunion hebdo", "kind": "meeting" }'`,
  },
  {
    method: "GET",
    path: "/api/v1/meetings",
    desc: "Lister les réunions du compte (filtre ?kind=meeting|webinar).",
    example: `curl ${BASE}/api/v1/meetings \\
  -H "Authorization: Bearer ngs_live_..."`,
  },
  {
    method: "GET",
    path: "/api/v1/meetings/{code}",
    desc: "Détail d'une réunion et liste de ses participants.",
    example: `curl ${BASE}/api/v1/meetings/equipe-hebdo \\
  -H "Authorization: Bearer ngs_live_..."`,
  },
  {
    method: "GET",
    path: "/api/v1/recordings",
    desc: "Lister les enregistrements avec leur compte rendu IA (résumé, décisions, tâches).",
    example: `curl ${BASE}/api/v1/recordings \\
  -H "Authorization: Bearer ngs_live_..."`,
  },
  {
    method: "GET",
    path: "/api/v1/webinars",
    desc: "Lister les webinaires et leur nombre d'inscrits.",
    example: `curl ${BASE}/api/v1/webinars \\
  -H "Authorization: Bearer ngs_live_..."`,
  },
  {
    method: "GET",
    path: "/api/v1/analytics/summary",
    desc: "Indicateurs clés : réunions, webinaires, enregistrements, durée totale.",
    example: `curl ${BASE}/api/v1/analytics/summary \\
  -H "Authorization: Bearer ngs_live_..."`,
  },
];

const METHOD_COLOR: Record<string, string> = {
  GET: "bg-sky-100 text-sky-700 border-sky-200",
  POST: "bg-emerald-100 text-emerald-700 border-emerald-200",
};

export default function DeveloppeursPage() {
  return (
    <div className="min-h-dvh bg-canvas">
      <header className="flex h-14 items-center justify-between bg-navy px-5">
        <Link href="/accueil" aria-label="NextGen Sync">
          <Logo />
        </Link>
        <Link href="/accueil" className="text-[13px] font-medium text-navy-muted hover:text-white">
          Retour à l&apos;application
        </Link>
      </header>

      <main className="mx-auto max-w-[860px] px-5 py-12">
        <div className="text-center">
          <span className="inline-block rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-[12px] font-semibold text-sky-700">
            API v1 · REST · JSON
          </span>
          <h1 className="mt-3 text-[28px] font-bold tracking-tight text-ink">API Développeurs</h1>
          <p className="mx-auto mt-2 max-w-[560px] text-[14px] text-ink-soft">
            Intégrez la visioconférence, les webinaires et les enregistrements de NextGen Sync
            directement dans vos applications. API REST, réponses JSON, authentification par clé.
          </p>
        </div>

        {/* Authentification */}
        <section className="mt-10 rounded-xl border border-hairline bg-white p-5">
          <h2 className="text-[16px] font-semibold text-ink">Authentification</h2>
          <p className="mt-1 text-[13px] text-ink-soft">
            Toutes les requêtes exigent une clé API dans l&apos;en-tête <code>Authorization</code>.
            Deux environnements : <code>ngs_live_…</code> (production) et <code>ngs_test_…</code> (bac à sable).
          </p>
          <pre className="mt-3 overflow-x-auto rounded-lg bg-navy px-4 py-3 text-[12px] text-sky-200">
{`Authorization: Bearer ngs_live_xxxxxxxxxxxxxxxx`}
          </pre>
          <p className="mt-2 text-[12px] text-ink-soft">
            Erreurs : <code>401 non_autorise</code> · <code>404 introuvable</code> ·{" "}
            <code>422 parametres_manquants</code> — format{" "}
            <code>{`{ "error": { "code", "message" } }`}</code>.
          </p>
        </section>

        {/* Endpoints */}
        <div className="mt-6 space-y-4">
          {ENDPOINTS.map((e) => (
            <section key={`${e.method} ${e.path}`} className="rounded-xl border border-hairline bg-white p-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`rounded border px-2 py-0.5 text-[12px] font-bold ${METHOD_COLOR[e.method]}`}>
                  {e.method}
                </span>
                <code className="text-[14px] font-medium text-ink">{e.path}</code>
              </div>
              <p className="mt-2 text-[13px] text-ink-soft">{e.desc}</p>
              <pre className="mt-3 overflow-x-auto rounded-lg bg-navy px-4 py-3 text-[12px] text-sky-200">
                {e.example}
              </pre>
            </section>
          ))}
        </div>

        <section className="mt-6 rounded-xl border border-hairline bg-white p-5">
          <h2 className="text-[16px] font-semibold text-ink">Obtenir une clé</h2>
          <p className="mt-1 text-[13px] text-ink-soft">
            Connectez-vous, puis rendez-vous dans <Link href="/parametres" className="text-sky-600 underline">Paramètres</Link>{" "}
            pour créer et gérer vos clés API. Chaque clé est liée à votre compte et à vos données.
          </p>
        </section>
      </main>
    </div>
  );
}
