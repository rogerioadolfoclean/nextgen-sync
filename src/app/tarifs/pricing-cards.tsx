"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { PLANS, type PlanId } from "@/lib/plans";

export function PricingCards() {
  const [loading, setLoading] = useState<PlanId | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function choose(plan: PlanId) {
    if (plan === "freemium") {
      window.location.href = "/accueil";
      return;
    }
    setLoading(plan);
    setNotice(null);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else if (data.demo) {
        setNotice(
          "Paiement en mode démo — ajoutez vos clés Stripe pour activer le checkout réel.",
        );
      } else {
        setNotice(data.error ?? "Une erreur est survenue.");
      }
    } catch {
      setNotice("Impossible de contacter le service de paiement.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <>
      <div className="grid gap-5 md:grid-cols-3">
        {PLANS.map((plan) => (
          <section
            key={plan.id}
            className={`flex flex-col rounded-2xl border bg-surface p-6 ${
              plan.highlighted
                ? "border-primary shadow-lg ring-1 ring-primary/20"
                : "border-hairline"
            }`}
          >
            {plan.highlighted && (
              <span className="mb-3 inline-flex w-fit items-center rounded-full bg-primary-soft px-2.5 py-1 text-[11px] font-semibold text-primary">
                Le plus populaire
              </span>
            )}
            <h2 className="text-[17px] font-bold text-ink">{plan.name}</h2>
            <p className="mt-1 text-[12.5px] text-ink-soft">{plan.tagline}</p>

            <p className="mt-4 flex items-baseline gap-1">
              <span className="text-[32px] font-bold tracking-tight text-ink">
                {plan.price === 0 ? "0 €" : `${plan.price} €`}
              </span>
              <span className="text-[12.5px] text-ink-soft">/ mois</span>
            </p>

            <ul className="mt-5 flex-1 space-y-2.5">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5">
                  <Check size={16} className="mt-0.5 shrink-0 text-accent-green" />
                  <span className="text-[13px] text-ink">{f}</span>
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={() => choose(plan.id)}
              disabled={loading !== null}
              className={`mt-6 h-11 rounded-xl text-[13.5px] font-semibold transition-colors disabled:opacity-50 ${
                plan.highlighted
                  ? "bg-primary text-white hover:bg-primary-hover"
                  : "border border-hairline bg-surface text-ink hover:bg-canvas"
              }`}
            >
              {loading === plan.id
                ? "Redirection..."
                : plan.price === 0
                  ? "Commencer gratuitement"
                  : "Choisir ce plan"}
            </button>
          </section>
        ))}
      </div>

      {notice && (
        <p className="mt-5 rounded-lg border border-hairline bg-primary-soft px-4 py-3 text-center text-[13px] text-ink">
          {notice}
        </p>
      )}
    </>
  );
}
