import { SearchBox } from "./search-box";
import { PageHeader } from "@/components/page-header";

export const metadata = { title: "Rechercher — NextGen Sync" };

export default function RecherchePage() {
  return (
    <div className="mx-auto max-w-[720px] px-5 py-6 md:px-7">
      <PageHeader
        title="Rechercher"
        subtitle="Réunions, webinaires, enregistrements et messages."
      />
      <div className="mt-5">
        <SearchBox />
      </div>
    </div>
  );
}
