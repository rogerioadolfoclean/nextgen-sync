"use client";

import { useEffect, useState } from "react";

function format(total: number) {
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

/** Chrono de reunion, amorce cote serveur puis incremente chaque seconde. */
export function Elapsed({
  from,
  className = "",
}: {
  from: number;
  className?: string;
}) {
  const [seconds, setSeconds] = useState(from);

  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <time className={`tabular-nums ${className}`}>{format(seconds)}</time>
  );
}
