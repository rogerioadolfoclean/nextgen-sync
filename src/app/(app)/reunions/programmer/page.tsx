import { ScheduleForm } from "./schedule-form";
import { PageHeader } from "@/components/page-header";

export const metadata = { title: "Programmer une réunion — NextGen Sync" };

export default function ProgrammerPage() {
  return (
    <div className="mx-auto max-w-[560px] px-5 py-6 md:px-7">
      <PageHeader
        title="Programmer une réunion"
        subtitle="Planifiez une réunion et partagez le lien avec vos invités."
      />
      <div className="mt-6">
        <ScheduleForm />
      </div>
    </div>
  );
}
