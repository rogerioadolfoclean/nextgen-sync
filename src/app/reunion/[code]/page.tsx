import { notFound } from "next/navigation";
import { getMeeting } from "@/lib/meetings";
import { MeetingRoom } from "./meeting-room";

export default async function ReunionPage(props: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await props.params;
  const meeting = await getMeeting(code);
  if (!meeting) notFound();

  return <MeetingRoom meeting={meeting} />;
}
