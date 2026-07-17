import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { hasStripe, stripe, webhookSecret } from "@/lib/stripe";
import { hasDatabase, query } from "@/lib/db";

/**
 * Webhook Stripe : synchronise l'abonnement en base a chaque evenement.
 * POST /api/stripe/webhook
 *
 * La signature est verifiee avec STRIPE_WEBHOOK_SECRET sur le corps BRUT
 * (request.text()), jamais sur un JSON reserialise.
 */
export async function POST(request: Request) {
  if (!hasStripe || !stripe) {
    return NextResponse.json({ error: "Stripe non configuré" }, { status: 503 });
  }

  const sig = request.headers.get("stripe-signature");
  const raw = await request.text();

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      raw,
      sig ?? "",
      webhookSecret,
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : "signature invalide";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  // Met a jour le plan de l'utilisateur selon l'evenement d'abonnement.
  async function applyPlan(userId: string | null, plan: string) {
    if (!userId || !hasDatabase) return;
    await query("UPDATE users SET plan = $1 WHERE id = $2", [plan, userId]);
    await query(
      `INSERT INTO subscriptions (user_id, plan, status)
       VALUES ($1, $2, 'active')
       ON CONFLICT (user_id) DO UPDATE
         SET plan = EXCLUDED.plan, status = 'active', updated_at = now()`,
      [userId, plan],
    );
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const s = event.data.object as Stripe.Checkout.Session;
      await applyPlan(
        s.metadata?.userId ?? s.client_reference_id ?? null,
        s.metadata?.plan ?? "pro",
      );
      break;
    }
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      await applyPlan(sub.metadata?.userId ?? null, "freemium");
      break;
    }
    default:
      // Autres evenements ignores pour l'instant.
      break;
  }

  return NextResponse.json({ received: true });
}
