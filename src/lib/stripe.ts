import "server-only";
import Stripe from "stripe";
import type { PlanId } from "@/lib/plans";

/**
 * Couche Stripe serveur.
 *
 * Sans STRIPE_SECRET_KEY, `hasStripe` vaut false : le checkout renvoie une
 * reponse de demonstration au lieu d'appeler Stripe. Il suffit d'ajouter les
 * cles et les price IDs pour activer les vrais paiements.
 */
export const hasStripe = Boolean(process.env.STRIPE_SECRET_KEY);

export const stripe = hasStripe
  ? new Stripe(process.env.STRIPE_SECRET_KEY as string)
  : null;

/** Correspondance plan -> price ID Stripe (renseignes au catalogue). */
export function priceIdFor(plan: PlanId): string | null {
  switch (plan) {
    case "pro":
      return process.env.STRIPE_PRICE_PRO ?? null;
    case "enterprise":
      return process.env.STRIPE_PRICE_ENTERPRISE ?? null;
    default:
      return null; // Freemium : pas de paiement
  }
}

export const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET ?? "";
