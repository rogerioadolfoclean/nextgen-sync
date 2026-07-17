const TINTS = [
  "#3b6cf8",
  "#41c069",
  "#6f5ad9",
  "#f79a2b",
  "#ec6d85",
  "#30b3b8",
];

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0] ?? "")
    .join("")
    .toUpperCase();
}

/** Teinte stable derivee du nom, pour que l'avatar d'une personne ne change jamais. */
function tintFor(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return TINTS[h % TINTS.length];
}

export function Avatar({
  name,
  src,
  size = 32,
  className = "",
}: {
  name: string;
  src?: string | null;
  size?: number;
  className?: string;
}) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={name}
        width={size}
        height={size}
        className={`shrink-0 rounded-full object-cover ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <span
      aria-hidden
      className={`grid shrink-0 place-items-center rounded-full font-semibold text-white ${className}`}
      style={{
        width: size,
        height: size,
        background: tintFor(name),
        fontSize: Math.max(9, Math.round(size * 0.38)),
      }}
    >
      {initials(name)}
    </span>
  );
}
