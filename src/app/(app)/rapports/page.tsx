import { Video, Clock, Users, Radio } from "lucide-react";
import { Card } from "@/components/ui";
import { PageHeader } from "@/components/page-header";

export const metadata = { title: "Rapports — NextGen Sync" };

const STATS = [
  { icon: Video, label: "Réunions ce mois", value: "48", trend: "+12%" },
  { icon: Clock, label: "Heures cumulées", value: "126 h", trend: "+8%" },
  { icon: Users, label: "Participants uniques", value: "312", trend: "+21%" },
  { icon: Radio, label: "Webinaires", value: "6", trend: "+2" },
];

/* Participation par jour (démo). */
const WEEK = [
  { day: "Lun", value: 62 },
  { day: "Mar", value: 78 },
  { day: "Mer", value: 55 },
  { day: "Jeu", value: 90 },
  { day: "Ven", value: 71 },
  { day: "Sam", value: 24 },
  { day: "Dim", value: 12 },
];

export default function RapportsPage() {
  const max = Math.max(...WEEK.map((d) => d.value));

  return (
    <div className="mx-auto max-w-[1000px] px-5 py-6 md:px-7">
      <PageHeader
        title="Rapports"
        subtitle="Mesurez la participation et l'engagement de vos équipes."
      />

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {STATS.map((s) => (
          <Card key={s.label} className="p-4">
            <div className="flex items-center justify-between">
              <span className="grid size-8 place-items-center rounded-lg bg-primary-soft text-primary">
                <s.icon size={16} />
              </span>
              <span className="text-[11px] font-semibold text-accent-green">
                {s.trend}
              </span>
            </div>
            <p className="mt-3 text-[22px] font-bold tracking-tight text-ink">
              {s.value}
            </p>
            <p className="text-[11.5px] text-ink-soft">{s.label}</p>
          </Card>
        ))}
      </div>

      <Card className="mt-4 p-5">
        <h2 className="text-[14px] font-semibold text-ink">
          Participation cette semaine
        </h2>
        <div className="mt-5 flex h-40 gap-3">
          {WEEK.map((d) => (
            <div key={d.day} className="flex flex-1 flex-col items-center gap-2">
              <div className="flex w-full min-h-0 flex-1 items-end">
                <div
                  className="w-full rounded-t-md bg-primary"
                  style={{ height: `${Math.max(4, (d.value / max) * 100)}%` }}
                  title={`${d.value} participants`}
                />
              </div>
              <span className="text-[11px] text-ink-soft">{d.day}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
