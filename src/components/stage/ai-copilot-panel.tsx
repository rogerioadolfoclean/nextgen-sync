"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle2, HelpCircle, Lightbulb, LoaderCircle, Sparkles, X } from "lucide-react";
import type { MeetingSuggestions } from "@/lib/ai";

export function AiCopilotPanel({ context, onClose }: { context: string; onClose: () => void }) {
  const [data, setData] = useState<MeetingSuggestions | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyze = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/ai/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ context }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Analyse impossible");
      setData(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Analyse impossible");
    } finally {
      setLoading(false);
    }
  };

  return (
    <aside className="flex min-h-0 w-[300px] shrink-0 flex-col border-l border-hairline bg-surface">
      <header className="flex items-center justify-between border-b border-hairline px-4 py-3">
        <div className="flex items-center gap-2"><Sparkles size={17} className="text-primary" /><h2 className="text-sm font-bold text-ink">Copilote IA</h2></div>
        <button type="button" onClick={onClose} aria-label="Fermer" className="text-muted hover:text-ink"><X size={16} /></button>
      </header>
      <div className="scroll-clean flex-1 overflow-y-auto p-4">
        {!data && !loading && (
          <div className="pt-8 text-center">
            <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary"><Sparkles size={24} /></div>
            <h3 className="mt-4 font-bold text-ink">Rendez la réunion plus intelligente</h3>
            <p className="mt-2 text-xs leading-5 text-muted">L’IA analyse les échanges et propose décisions, questions, risques et actions prioritaires.</p>
            <button type="button" onClick={analyze} className="mt-5 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white">Analyser maintenant</button>
          </div>
        )}
        {loading && <div className="grid place-items-center gap-3 pt-16 text-sm text-muted"><LoaderCircle className="animate-spin text-primary" /><span>Analyse intelligente en cours…</span></div>}
        {error && <div className="rounded-xl bg-danger/10 p-3 text-xs text-danger">{error}<button type="button" onClick={analyze} className="mt-2 block font-bold underline">Réessayer</button></div>}
        {data && (
          <div className="space-y-5">
            <div className="rounded-xl bg-primary/8 p-3 text-xs leading-5 text-ink">{data.overview}</div>
            <Section icon={Lightbulb} title="Suggestions" items={data.suggestions} tone="text-amber-500" />
            <Section icon={HelpCircle} title="Questions importantes" items={data.questions} tone="text-primary" />
            <Section icon={AlertTriangle} title="Risques détectés" items={data.risks} tone="text-danger" />
            <section><h3 className="flex items-center gap-2 text-xs font-bold uppercase text-muted"><CheckCircle2 size={14} className="text-accent-green" /> Actions recommandées</h3><ul className="mt-2 space-y-2">{data.actions.map((a, i) => <li key={i} className="rounded-lg border border-hairline p-2.5 text-xs text-ink"><span className={`mr-2 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase ${a.priority === "haute" ? "bg-danger/10 text-danger" : "bg-canvas text-muted"}`}>{a.priority}</span>{a.task}{a.owner && <span className="mt-1 block text-muted">Responsable : {a.owner}</span>}</li>)}</ul></section>
            <button type="button" onClick={analyze} className="w-full rounded-xl border border-primary px-3 py-2 text-xs font-bold text-primary">Actualiser l’analyse</button>
          </div>
        )}
      </div>
    </aside>
  );
}

function Section({ icon: Icon, title, items, tone }: { icon: typeof Lightbulb; title: string; items: string[]; tone: string }) {
  if (!items.length) return null;
  return <section><h3 className="flex items-center gap-2 text-xs font-bold uppercase text-muted"><Icon size={14} className={tone} />{title}</h3><ul className="mt-2 space-y-2">{items.map((item, i) => <li key={i} className="rounded-lg bg-canvas p-2.5 text-xs leading-5 text-ink">{item}</li>)}</ul></section>;
}
