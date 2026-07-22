import { notFound } from "next/navigation";
import { getWebinar } from "@/lib/webinars";
import { WebinarStage } from "./webinar-stage";
import { IdentityGate } from "@/components/identity-gate";

export default async function WebinairePage(props: {
  params: Promise<{ code: string }>;
}) {
  // Next.js 16 : params est une promesse, l'acces synchrone n'existe plus.
  const { code } = await props.params;
  const webinar = await getWebinar(code);
  if (!webinar) notFound();

  return <IdentityGate><WebinarStage webinar={webinar} /></IdentityGate>;
}
