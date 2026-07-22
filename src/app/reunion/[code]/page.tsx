import { notFound } from "next/navigation";
import { getMeeting } from "@/lib/meetings";
import { IdentityGate } from "@/components/identity-gate";
import { MeetingEntry } from "./meeting-entry";

export default async function ReunionPage(props: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await props.params;
  const meeting = await getMeeting(code);
  if (!meeting) notFound();

  return <IdentityGate><MeetingEntry meeting={meeting} /></IdentityGate>;
}
