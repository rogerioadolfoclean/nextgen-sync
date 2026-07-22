import { notFound } from "next/navigation";
import { getMeeting } from "@/lib/meetings";
import { MeetingRoom } from "./meeting-room";
import { IdentityGate } from "@/components/identity-gate";

export default async function ReunionPage(props: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await props.params;
  const meeting = await getMeeting(code);
  if (!meeting) notFound();

  return <IdentityGate><MeetingRoom meeting={meeting} /></IdentityGate>;
}
