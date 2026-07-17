import { NextResponse } from "next/server";
import { hasStripe, stripe, priceIdFor } from "@/lib/stripe";
import { planById } from "@/lib/plans";
import { getSessionUser } from "@/lib/session";

/**
 * Ouvre une session de paiement Stripe pour un plan.
 * POST /api/stripe/checkout  { plan: "pro" | "enterprise" }
 *
 * En mode demo (pas de cles), renvoie { demo: true } : la page de tarifs
 * affiche alors un message au lieu de rediriger.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const plan = planById(body?.plan);

  if (!plan || plan.id === "freemium") {
    return NextResponse.json({ error: "plan payant requis" }, { status: 400 });
  }

  if (!hasStripe || !stripe) {
    return NextResponse.json({ demo: true, plan: plan.id });
  }

  const priceId = priceIdFor(plan.id);
  if (!priceId) {
    return NextResponse.json(
      { error: `Prix Stripe non configuré pour ${plan.id}` },
      { status: 500 },
    );
  }

  const user = await getSessionUser();
  const origin = new URL(request.url).origin;

  const checkout = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    customer_email: user.email,
    client_reference_id: user.id,
    metadata: { userId: user.id, plan: plan.id },
    success_url: `${origin}/parametres?abonnement=ok`,
    cancel_url: `${origin}/tarifs?annule=1`,
  });

  return NextResponse.json({ url: checkout.url });
}
