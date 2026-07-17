"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight } from "lucide-react";

/** Slugifie le code saisi pour l'utiliser dans l'URL de la salle. */
function toCode(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function JoinForm() {
  const router = useRouter();
  const [value, setValue] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const code = toCode(value);
    if (code) router.push(`/reunion/${code}`);
  }

  return (
    <form onSubmit={submit} className="rounded-card border border-hairline bg-surface p-5">
      <label htmlFor="code" className="text-[12.5px] font-semibold text-ink">
        Code de la réunion
      </label>
      <input
        id="code"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="ex. equipe-hebdo"
        autoFocus
        className="mt-2 h-11 w-full rounded-lg border border-hairline bg-surface px-3.5 text-[14px] text-ink outline-none placeholder:text-ink-soft focus:border-primary focus:ring-2 focus:ring-primary/15"
      />
      <button
        type="submit"
        disabled={!toCode(value)}
        className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary text-[13.5px] font-semibold text-white transition-colors hover:bg-primary-hover disabled:opacity-40"
      >
        Rejoindre <ArrowRight size={16} />
      </button>
    </form>
  );
}
