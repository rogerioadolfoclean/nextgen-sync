export type PollOption = {
  label: string;
  percent: number;
};

export type Poll = {
  question: string;
  options: PollOption[];
};

/** "Sondage en cours" du panneau lateral : question + barres de resultats. */
export function PollPanel({ poll }: { poll: Poll }) {
  return (
    <section className="border-t border-hairline p-4">
      <h3 className="text-[13.5px] font-semibold text-ink">Sondage en cours</h3>
      <p className="mt-2.5 text-[12.5px] font-semibold text-ink">
        {poll.question}
      </p>

      <ul className="mt-3 space-y-2.5">
        {poll.options.map((o) => (
          <li key={o.label}>
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-[12px] text-ink">{o.label}</span>
              <span className="text-[11.5px] font-medium text-ink-soft tabular-nums">
                {o.percent}%
              </span>
            </div>
            <div
              className="mt-1 h-1.5 overflow-hidden rounded-full bg-hairline"
              role="meter"
              aria-valuenow={o.percent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={o.label}
            >
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${o.percent}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
