import Link from "next/link";
import { notFound } from "next/navigation";
import { Play, ArrowLeft, Download, Share2, Sparkles } from "lucide-react";
import { getSessionUser } from "@/lib/session";
import { getRecording } from "@/lib/data";
import { Card } from "@/components/ui";

export default async function EnregistrementDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const user = await getSessionUser();
  const rec = await getRecording(user.id, id);
  if (!rec) notFound();

  return (
    <div className="mx-auto max-w-[860px] px-5 py-6 md:px-7">
      <Link
        href="/enregistrements"
        className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-ink-soft hover:text-ink"
      >
        <ArrowLeft size={15} /> Enregistrements
      </Link>

      <h1 className="mt-3 text-[20px] font-bold tracking-tight text-ink">
        {rec.title}
      </h1>
      <p className="mt-1 text-[12.5px] text-ink-soft">
        Enregistré le {rec.recordedOn} · Durée {rec.duration}
      </p>

      {/* Lecteur (placeholder tant que le fichier n'est pas relie a Vercel Blob) */}
      <div className="mt-5 grid aspect-video place-items-center rounded-card bg-navy">
        <button
          type="button"
          className="grid size-16 place-items-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25"
          aria-label="Lire l'enregistrement"
        >
          <Play size={26} fill="currentColor" />
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2.5">
        <button className="flex h-10 items-center gap-2 rounded-lg border border-hairline bg-surface px-4 text-[12.5px] font-semibold text-ink hover:bg-canvas">
          <Download size={15} /> Télécharger
        </button>
        <button className="flex h-10 items-center gap-2 rounded-lg border border-hairline bg-surface px-4 text-[12.5px] font-semibold text-ink hover:bg-canvas">
          <Share2 size={15} /> Partager
        </button>
      </div>

      {/* Compte rendu IA (branche sur /api/ai/recap une fois la cle ajoutee) */}
      <Card className="mt-6 p-5">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-accent-violet" />
          <h2 className="text-[14px] font-semibold text-ink">Compte rendu IA</h2>
        </div>
        <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">
          Résumé, décisions et tâches sont générés automatiquement à partir de la
          transcription. Ajoutez votre clé Anthropic pour activer la génération
          réelle — le module est déjà câblé sur l&apos;API.
        </p>
      </Card>
    </div>
  );
}
