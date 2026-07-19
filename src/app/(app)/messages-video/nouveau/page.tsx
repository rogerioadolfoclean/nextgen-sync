import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui";
import { VideoRecorder } from "./recorder";

export const metadata = { title: "Nouveau message vidéo — NextGen Sync" };

export default function NouveauMessageVideoPage() {
  return (
    <div className="mx-auto max-w-[720px] px-5 py-6 md:px-7">
      <Link
        href="/messages-video"
        className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-ink-soft hover:text-ink md:hidden"
      >
        <ArrowLeft size={15} /> Messages vidéo
      </Link>

      <PageHeader
        title="Nouveau message vidéo"
        subtitle="Enregistrez votre caméra, votre écran, ou les deux."
      />

      <div className="mt-6">
        <VideoRecorder />

        <Card className="mt-6 p-4">
          <p className="text-[12.5px] text-ink-soft">
            L&apos;enregistrement fonctionne dans votre navigateur : vous pouvez
            capturer, relire et télécharger le fichier. L&apos;envoi direct à un
            destinataire (stockage Vercel Blob + table <code>video_messages</code>)
            s&apos;ajoute automatiquement une fois la base connectée.
          </p>
        </Card>
      </div>
    </div>
  );
}
