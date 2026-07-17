import Link from "next/link";
import { Logo } from "@/components/logo";
import { PricingCards } from "./pricing-cards";

export const metadata = {
  title: "Tarifs — NextGen Sync",
  description:
    "Freemium, Pro et Enterprise : choisissez le plan adapté à votre équipe.",
};

export default function TarifsPage() {
  return (
    <div className="min-h-dvh bg-canvas">
      <header className="flex h-14 items-center justify-between bg-navy px-5">
        <Link href="/accueil" aria-label="NextGen Sync">
          <Logo />
        </Link>
        <Link
          href="/accueil"
          className="text-[13px] font-medium text-navy-muted hover:text-white"
        >
          Retour à l&apos;application
        </Link>
      </header>

      <main className="mx-auto max-w-[980px] px-5 py-12">
        <div className="text-center">
          <h1 className="text-[28px] font-bold tracking-tight text-ink">
            Un plan pour chaque équipe
          </h1>
          <p className="mx-auto mt-2 max-w-[520px] text-[14px] text-ink-soft">
            Commencez gratuitement, passez au niveau supérieur quand vous êtes
            prêt. Sans engagement, annulable à tout moment.
          </p>
        </div>

        <div className="mt-10">
          <PricingCards />
        </div>
      </main>
    </div>
  );
}
