import Link from "next/link";
import Image from "next/image";
import {
  Video,
  Users,
  Captions,
  PenLine,
  ChartNoAxesColumn,
  ShieldCheck,
  Monitor,
  Sparkles,
  Handshake,
  TrendingUp,
  Zap,
  Target,
  Rocket,
  Globe,
  Building2,
  GraduationCap,
  Stethoscope,
  Landmark,
  ArrowRight,
  CircleCheckBig,
  type LucideIcon,
} from "lucide-react";
import { Logo } from "@/components/logo";

export const metadata = {
  title: "NextGen Sync — Réunions, collaboration et IA, réunis",
  description:
    "Visioconférence HD, tableau blanc, sous-titres et traduction IA, webinaires, sondages et enregistrements — dans une seule plateforme, sur tous vos écrans.",
};

/* Les 6 fonctionnalités clés du mockup (panneau de droite). */
const FEATURES: { icon: LucideIcon; color: string; title: string; text: string }[] =
  [
    {
      icon: Video,
      color: "#3b6cf8",
      title: "Visioconférence HD",
      text: "Qualité HD, faible latence et stabilité garantie, même à plusieurs centaines de participants.",
    },
    {
      icon: Users,
      color: "#41c069",
      title: "Salles de sous-groupes",
      text: "Créez, gérez et assignez des sous-groupes facilement pour le travail en ateliers.",
    },
    {
      icon: Captions,
      color: "#6f5ad9",
      title: "Sous-titres & Traduction IA",
      text: "Sous-titres en temps réel et traduction multilingue : chacun suit dans sa langue.",
    },
    {
      icon: PenLine,
      color: "#f79a2b",
      title: "Tableau blanc collaboratif",
      text: "Dessinez, notez et partagez vos idées en temps réel, ensemble sur le même plan.",
    },
    {
      icon: ChartNoAxesColumn,
      color: "#ec6d85",
      title: "Sondages & Analytique",
      text: "Interagissez et mesurez l'engagement : votes en direct et statistiques de participation.",
    },
    {
      icon: ShieldCheck,
      color: "#30b3b8",
      title: "Sécurité avancée",
      text: "Chiffrement de bout en bout, salle d'attente et conformité RGPD / HIPAA.",
    },
  ];

/* Les 6 badges du bas du mockup. */
const BADGES: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: Monitor, title: "Multi-plateforme", text: "Web, iOS, Android, Desktop" },
  { icon: Zap, title: "Haute qualité", text: "Audio HD, vidéo 1080p, faible latence" },
  { icon: Sparkles, title: "IA intelligente", text: "Transcription, traduction, suppression de bruit" },
  { icon: Handshake, title: "Collaboration avancée", text: "Tableau blanc, sondages, partage d'écran" },
  { icon: ShieldCheck, title: "Sécurisé & conforme", text: "RGPD, HIPAA, SOC2, chiffrement E2E" },
  { icon: TrendingUp, title: "Scalable", text: "De 1 à 100 000 participants" },
];

/* Les exemples du document de référence — « Pourquoi ce système ». */
const EXAMPLES: { icon: LucideIcon; color: string; title: string; text: string }[] =
  [
    {
      icon: Building2,
      color: "#3b6cf8",
      title: "Une entreprise",
      text: "Des agences à Kinshasa, Luanda et Paris tiennent une seule réunion hebdomadaire. Moins de déplacements, des décisions plus rapides, des équipes synchronisées.",
    },
    {
      icon: GraduationCap,
      color: "#41c069",
      title: "Une école",
      text: "Un professeur enseigne à des étudiants en RDC, Angola, France, Brésil et Canada. L'IA traduit les sous-titres, le cours est enregistré pour les absents.",
    },
    {
      icon: Stethoscope,
      color: "#ec6d85",
      title: "Un médecin",
      text: "Un cardiologue consulte un patient à 800 km : il examine les analyses en direct, explique, et l'ordonnance est envoyée automatiquement.",
    },
    {
      icon: Globe,
      color: "#6f5ad9",
      title: "Une équipe internationale",
      text: "Le directeur parle français, un employé anglais, un autre portugais. Le système traduit en temps réel : chacun entend la réunion dans sa langue.",
    },
    {
      icon: Landmark,
      color: "#f79a2b",
      title: "Un gouvernement",
      text: "Un ministère réunit gouverneurs, préfets, police et hôpitaux. Les documents sont partagés, les décisions enregistrées, le procès-verbal généré automatiquement.",
    },
    {
      icon: Users,
      color: "#30b3b8",
      title: "Un créateur de contenu",
      text: "Webinaires, cours en ligne, lancements de produits et conférences payantes — jusqu'à 100 000 participants, avec sondages et enregistrement.",
    },
  ];

export default function LandingPage() {
  return (
    <div className="min-h-dvh bg-canvas">
      {/* ---------- Barre de navigation ---------- */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-navy/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[1120px] items-center justify-between px-5">
          <Logo />
          <nav className="hidden items-center gap-6 md:flex">
            <a href="#objectif" className="text-[13px] font-medium text-navy-muted hover:text-white">
              Notre objectif
            </a>
            <a href="#pourquoi" className="text-[13px] font-medium text-navy-muted hover:text-white">
              Pourquoi
            </a>
            <a href="#fonctionnalites" className="text-[13px] font-medium text-navy-muted hover:text-white">
              Fonctionnalités
            </a>
            <Link href="/tarifs" className="text-[13px] font-medium text-navy-muted hover:text-white">
              Tarifs
            </Link>
          </nav>
          <Link
            href="/accueil"
            className="flex h-9 items-center gap-1.5 rounded-lg bg-primary px-4 text-[13px] font-semibold text-white transition-colors hover:bg-primary-hover"
          >
            Ouvrir l&apos;app
            <ArrowRight size={15} />
          </Link>
        </div>
      </header>

      {/* ---------- Hero + vitrine du mockup ---------- */}
      <section className="bg-navy">
        <div className="mx-auto max-w-[1120px] px-5 pt-16 pb-12 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[12px] font-medium text-white">
            <Sparkles size={13} /> Réunions · Collaboration · Intelligence artificielle
          </span>
          <h1 className="mx-auto mt-5 max-w-[760px] text-[34px] leading-[1.12] font-bold tracking-tight text-white sm:text-[46px]">
            Toute votre communication d&apos;équipe, réunie dans une seule
            plateforme
          </h1>
          <p className="mx-auto mt-4 max-w-[620px] text-[15px] leading-relaxed text-navy-muted">
            Visioconférence HD, tableau blanc collaboratif, sous-titres et
            traduction IA, webinaires, sondages et enregistrements — sur PC,
            tablette et mobile. Comme si tout le monde était dans la même pièce.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/accueil"
              className="flex h-11 items-center gap-2 rounded-xl bg-primary px-6 text-[14px] font-semibold text-white transition-colors hover:bg-primary-hover"
            >
              <Rocket size={16} /> Commencer gratuitement
            </Link>
            <Link
              href="/tarifs"
              className="flex h-11 items-center rounded-xl border border-white/15 bg-white/5 px-6 text-[14px] font-semibold text-white transition-colors hover:bg-white/10"
            >
              Voir les tarifs
            </Link>
          </div>
        </div>

        {/* Le mockup de référence, mis en vitrine */}
        <div className="mx-auto max-w-[1120px] px-5 pb-16">
          <div className="overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
            <Image
              src="/showcase.png"
              alt="Aperçu de NextGen Sync sur PC, tablette et mobile"
              width={1536}
              height={1024}
              priority
              unoptimized
              className="w-full"
            />
          </div>
        </div>
      </section>

      {/* ---------- Les 6 badges ---------- */}
      <section className="border-b border-hairline bg-surface">
        <div className="mx-auto grid max-w-[1120px] grid-cols-2 gap-x-6 gap-y-6 px-5 py-10 md:grid-cols-3 lg:grid-cols-6">
          {BADGES.map((b) => (
            <div key={b.title} className="flex flex-col gap-1.5">
              <b.icon size={20} className="text-primary" />
              <p className="text-[13px] font-semibold text-ink">{b.title}</p>
              <p className="text-[11.5px] leading-snug text-ink-soft">{b.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Qui sommes-nous ---------- */}
      <section id="qui" className="mx-auto max-w-[900px] px-5 py-16 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1 text-[12px] font-semibold text-primary">
          <Handshake size={13} /> Qui sommes-nous ?
        </span>
        <h2 className="mt-4 text-[26px] font-bold tracking-tight text-ink">
          Une plateforme de collaboration unifiée, pensée pour le monde réel
        </h2>
        <p className="mx-auto mt-4 max-w-[680px] text-[15px] leading-relaxed text-ink-soft">
          NextGen Sync est une plateforme professionnelle de communication et de
          collaboration, comparable à Zoom, Microsoft Teams ou Google Meet, mais
          qui va plus loin : au lieu de jongler entre visioconférence, chat,
          tableau blanc, traduction, sondages et enregistrement, tout est réuni
          dans une seule interface — simple pour un débutant, puissante pour une
          organisation.
        </p>
      </section>

      {/* ---------- Notre objectif ---------- */}
      <section id="objectif" className="bg-surface">
        <div className="mx-auto grid max-w-[1000px] items-center gap-10 px-5 py-16 md:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1 text-[12px] font-semibold text-primary">
              <Target size={13} /> Quel est notre objectif ?
            </span>
            <h2 className="mt-4 text-[26px] font-bold tracking-tight text-ink">
              Rapprocher les gens, où qu&apos;ils soient
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
              Permettre à des personnes situées partout dans le monde de{" "}
              <strong className="text-ink">communiquer, travailler, enseigner,
              vendre, former et collaborer</strong> comme si elles étaient dans
              la même pièce — sans multiplier les outils ni les déplacements.
            </p>
            <ul className="mt-5 space-y-2.5">
              {[
                "Une seule plateforme au lieu de cinq applications séparées",
                "L'IA génère compte rendu, décisions et tâches automatiquement",
                "Accessible à tous, du débutant à l'entreprise internationale",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <CircleCheckBig size={17} className="mt-0.5 shrink-0 text-accent-green" />
                  <span className="text-[13.5px] text-ink">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-hairline bg-canvas p-6">
            <p className="text-[13px] font-semibold text-ink-soft">Avant</p>
            <p className="mt-1 text-[13.5px] text-ink">
              Zoom + WhatsApp + Google Docs + Trello + Google Translate…
            </p>
            <div className="my-4 h-px bg-hairline" />
            <p className="text-[13px] font-semibold text-primary">Avec NextGen Sync</p>
            <p className="mt-1 text-[13.5px] text-ink">
              Le responsable clique sur « Nouvelle réunion ». Caméra HD, partage
              d&apos;écran, tableau blanc, traduction, chat, enregistrement et
              vote — puis l&apos;IA rédige le compte rendu. Tout au même endroit.
            </p>
          </div>
        </div>
      </section>

      {/* ---------- Pourquoi ce système + exemples ---------- */}
      <section id="pourquoi" className="mx-auto max-w-[1120px] px-5 py-16">
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1 text-[12px] font-semibold text-primary">
            <Sparkles size={13} /> Pourquoi ce système est important
          </span>
          <h2 className="mt-4 text-[26px] font-bold tracking-tight text-ink">
            Un même outil, des usages qui changent le quotidien
          </h2>
          <p className="mx-auto mt-3 max-w-[600px] text-[14px] text-ink-soft">
            Entreprises, écoles, hôpitaux, ONG, administrations, consultants,
            créateurs — voici comment ils l&apos;utilisent.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {EXAMPLES.map((ex) => (
            <article
              key={ex.title}
              className="rounded-2xl border border-hairline bg-surface p-5"
            >
              <span
                className="grid size-10 place-items-center rounded-xl text-white"
                style={{ background: ex.color }}
              >
                <ex.icon size={19} />
              </span>
              <h3 className="mt-4 text-[15px] font-bold text-ink">{ex.title}</h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-ink-soft">
                {ex.text}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* ---------- Fonctionnalités clés ---------- */}
      <section id="fonctionnalites" className="bg-surface">
        <div className="mx-auto max-w-[1120px] px-5 py-16">
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1 text-[12px] font-semibold text-primary">
              <Rocket size={13} /> Fonctionnalités clés
            </span>
            <h2 className="mt-4 text-[26px] font-bold tracking-tight text-ink">
              Tout ce qu&apos;il faut pour réunir, collaborer et décider
            </h2>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <article
                key={f.title}
                className="rounded-2xl border border-hairline bg-canvas p-5"
              >
                <span
                  className="grid size-10 place-items-center rounded-xl text-white"
                  style={{ background: f.color }}
                >
                  <f.icon size={19} />
                </span>
                <h3 className="mt-4 text-[15px] font-bold text-ink">{f.title}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-ink-soft">
                  {f.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Appel à l'action final ---------- */}
      <section className="bg-navy">
        <div className="mx-auto max-w-[760px] px-5 py-16 text-center">
          <h2 className="text-[28px] font-bold tracking-tight text-white">
            Prêt à réunir vos équipes ?
          </h2>
          <p className="mx-auto mt-3 max-w-[520px] text-[14px] text-navy-muted">
            Créez votre première réunion en quelques secondes. Aucune carte
            bancaire requise pour commencer.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/accueil"
              className="flex h-11 items-center gap-2 rounded-xl bg-primary px-6 text-[14px] font-semibold text-white transition-colors hover:bg-primary-hover"
            >
              <Rocket size={16} /> Commencer gratuitement
            </Link>
            <Link
              href="/tarifs"
              className="flex h-11 items-center rounded-xl border border-white/15 bg-white/5 px-6 text-[14px] font-semibold text-white transition-colors hover:bg-white/10"
            >
              Comparer les plans
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- Pied de page ---------- */}
      <footer className="border-t border-white/10 bg-navy">
        <div className="mx-auto flex max-w-[1120px] flex-col items-center justify-between gap-4 px-5 py-8 sm:flex-row">
          <Logo />
          <p className="text-[12px] text-navy-muted">
            © 2026 NextGen Sync — Visioconférence & collaboration unifiée
          </p>
          <div className="flex gap-5">
            <Link href="/accueil" className="text-[12.5px] text-navy-muted hover:text-white">
              Application
            </Link>
            <Link href="/tarifs" className="text-[12.5px] text-navy-muted hover:text-white">
              Tarifs
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
