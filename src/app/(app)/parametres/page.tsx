import Link from "next/link";
import { ShieldCheck, CreditCard, User, ArrowRight } from "lucide-react";
import { getSessionUser } from "@/lib/session";
import { Avatar } from "@/components/avatar";
import { Card } from "@/components/ui";
import { PageHeader } from "@/components/page-header";

export const metadata = { title: "Paramètres — NextGen Sync" };

export default async function ParametresPage() {
  const user = await getSessionUser();
  const isAdmin = user.role === "Admin";

  return (
    <div className="mx-auto max-w-[720px] px-5 py-6 md:px-7">
      <PageHeader title="Paramètres" subtitle="Votre profil, votre plan et la sécurité." />

      {/* Profil */}
      <Card className="mt-6 p-5">
        <div className="flex items-center gap-2 text-ink-soft">
          <User size={15} />
          <h2 className="text-[13px] font-semibold text-ink">Profil</h2>
        </div>
        <div className="mt-4 flex items-center gap-4">
          <Avatar name={user.name} src={user.avatarUrl} size={52} />
          <div className="min-w-0">
            <p className="truncate text-[15px] font-semibold text-ink">{user.name}</p>
            <p className="truncate text-[12.5px] text-ink-soft">{user.email}</p>
            <span className="mt-1 inline-flex items-center rounded-md bg-primary-soft px-2 py-0.5 text-[10.5px] font-semibold text-primary">
              {user.role}
            </span>
          </div>
        </div>
      </Card>

      {/* Abonnement */}
      <Card className="mt-4 p-5">
        <div className="flex items-center gap-2 text-ink-soft">
          <CreditCard size={15} />
          <h2 className="text-[13px] font-semibold text-ink">Abonnement</h2>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-[14px] font-semibold text-ink">Plan actuel</p>
            <p className="text-[12.5px] text-ink-soft">
              Gérez votre offre et vos options de facturation.
            </p>
          </div>
          <Link
            href="/tarifs"
            className="flex h-10 shrink-0 items-center gap-1.5 rounded-lg bg-primary px-4 text-[12.5px] font-semibold text-white hover:bg-primary-hover"
          >
            Voir les plans <ArrowRight size={14} />
          </Link>
        </div>
      </Card>

      {/* Sécurité */}
      <Card className="mt-4 p-5">
        <div className="flex items-center gap-2 text-ink-soft">
          <ShieldCheck size={15} />
          <h2 className="text-[13px] font-semibold text-ink">Sécurité</h2>
        </div>
        <ul className="mt-3 space-y-2 text-[12.5px] text-ink-soft">
          <li>· Chiffrement de bout en bout (E2E) sur les réunions</li>
          <li>· Salle d&apos;attente et contrôle des participants</li>
          <li>· Conformité RGPD / HIPAA selon la configuration</li>
        </ul>
      </Card>

      {isAdmin && (
        <Card className="mt-4 border-primary/30 p-5">
          <h2 className="text-[13px] font-semibold text-primary">
            Espace administrateur
          </h2>
          <p className="mt-2 text-[12.5px] text-ink-soft">
            Vous êtes connecté en tant qu&apos;administrateur. La gestion des
            utilisateurs, des rôles et de l&apos;audit sera disponible ici une
            fois la base de données branchée.
          </p>
        </Card>
      )}
    </div>
  );
}
