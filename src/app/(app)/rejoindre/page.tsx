import { JoinForm } from "./join-form";
import { PageHeader } from "@/components/page-header";

export const metadata = { title: "Rejoindre une réunion — NextGen Sync" };

export default function RejoindrePage() {
  return (
    <div className="mx-auto max-w-[520px] px-5 py-6 md:px-7">
      <PageHeader
        title="Rejoindre une réunion"
        subtitle="Entrez le code fourni par l'organisateur."
      />
      <div className="mt-6">
        <JoinForm />
      </div>
    </div>
  );
}
