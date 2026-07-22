"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { UserRoundCheck } from "lucide-react";

const STORAGE_KEY = "nextgen-real-name";

type Identity = { firstName: string; lastName: string; fullName: string };

const IdentityContext = createContext<Identity | null>(null);

export function useIdentity() {
  return useContext(IdentityContext);
}

export function IdentityGate({ children }: { children: React.ReactNode }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null") as Identity | null;
      if (saved?.firstName?.trim() && saved?.lastName?.trim()) setIdentity(saved);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
    setReady(true);
  }, []);

  const value = useMemo(() => identity, [identity]);

  const validate = (event: React.FormEvent) => {
    event.preventDefault();
    const first = firstName.trim().replace(/\s+/g, " ");
    const last = lastName.trim().replace(/\s+/g, " ");
    if (first.length < 2 || last.length < 2) {
      setError("Veuillez saisir votre vrai prénom et votre vrai nom.");
      return;
    }
    const next = { firstName: first, lastName: last, fullName: `${first} ${last}` };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setIdentity(next);
  };

  if (!ready) return <div className="min-h-dvh bg-canvas" />;

  return (
    <IdentityContext.Provider value={value}>
      {identity ? children : (
        <div className="fixed inset-0 z-[9999] grid place-items-center bg-navy px-4">
          <form onSubmit={validate} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
            <div className="mb-5 grid size-12 place-items-center rounded-xl bg-primary text-white">
              <UserRoundCheck size={26} />
            </div>
            <h1 className="text-2xl font-bold text-ink">Identifiez-vous avant de continuer</h1>
            <p className="mt-2 text-sm leading-6 text-muted">
              Votre vrai nom sera affiché dans les réunions, le chat, la liste des participants et le tableau blanc.
            </p>

            <label className="mt-6 block text-sm font-semibold text-ink" htmlFor="identity-first-name">Prénom réel *</label>
            <input
              id="identity-first-name"
              autoFocus
              autoComplete="given-name"
              value={firstName}
              onChange={(e) => { setFirstName(e.target.value); setError(""); }}
              className="mt-2 w-full rounded-xl border border-line px-4 py-3 text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder="Ex. Rogério"
            />

            <label className="mt-4 block text-sm font-semibold text-ink" htmlFor="identity-last-name">Nom réel *</label>
            <input
              id="identity-last-name"
              autoComplete="family-name"
              value={lastName}
              onChange={(e) => { setLastName(e.target.value); setError(""); }}
              className="mt-2 w-full rounded-xl border border-line px-4 py-3 text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder="Ex. Kabongo"
            />

            {error && <p role="alert" className="mt-3 text-sm font-medium text-danger">{error}</p>}
            <button type="submit" className="mt-6 w-full rounded-xl bg-primary px-4 py-3 font-semibold text-white hover:opacity-90">
              Confirmer mon identité et continuer
            </button>
            <p className="mt-3 text-center text-xs text-muted">Les deux champs sont obligatoires.</p>
          </form>
        </div>
      )}
    </IdentityContext.Provider>
  );
}
