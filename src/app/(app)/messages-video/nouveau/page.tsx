import Link from "next/link";
import { ArrowLeft, Video, Monitor, Circle } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui";

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
        <div className="grid aspect-video place-items-center rounded-card bg-navy text-white/60">
          <div className="text-center">
            <Circle size={40} className="mx-auto text-danger" fill="currentColor" />
            <p className="mt-3 text-[13px]">Prêt à enregistrer</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <button className="flex h-11 items-center justify-center gap-2 rounded-lg border border-hairline bg-surface text-[12.5px] font-semibold text-ink hover:bg-canvas">
            <Video size={15} /> Caméra
          </button>
          <button className="flex h-11 items-center justify-center gap-2 rounded-lg border border-hairline bg-surface text-[12.5px] font-semibold text-ink hover:bg-canvas">
            <Monitor size={15} /> Écran
          </button>
        </div>

        <button className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-danger text-[13px] font-semibold text-white hover:bg-danger-hover">
          <Circle size={13} fill="currentColor" /> Démarrer l&apos;enregistrement
        </button>

        <Card className="mt-6 p-4">
          <p className="text-[12.5px] text-ink-soft">
            L&apos;enregistrement et l&apos;envoi seront reliés au stockage
            (Vercel Blob) et à la table <code>video_messages</code> une fois la
            base branchée. L&apos;interface est prête.
          </p>
        </Card>
      </div>
    </div>
  );
}
