"use client";

import { useEffect, useState } from "react";

/** Toujours HH:MM:SS, heures comprises : le mockup affiche "00:24:18". */
function format(total: number) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return [
    Math.floor(total / 3600),
    Math.floor((total % 3600) / 60),
    total % 60,
  ]
    .map(pad)
    .join(":");
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
