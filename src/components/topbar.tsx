import { Search, Bell, CircleQuestionMark } from "lucide-react";
import { InviteButton } from "@/components/invite-button";

export function TopBar({ unread = 0 }: { unread?: number }) {
  return (
    <header className="flex h-[52px] shrink-0 items-center gap-3 border-b border-hairline bg-surface px-5">
      <label className="relative ml-auto hidden sm:block">
        <span className="sr-only">Rechercher</span>
        <Search
          size={14}
          className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-ink-soft"
        />
        <input
          type="search"
          placeholder="Rechercher..."
          className="h-8 w-[220px] rounded-lg border border-hairline bg-surface pr-3 pl-8 text-[12.5px] text-ink outline-none placeholder:text-ink-soft focus:border-primary focus:ring-2 focus:ring-primary/15"
        />
      </label>

      <button
        type="button"
        className="relative ml-auto grid size-8 place-items-center rounded-lg text-ink-soft transition-colors hover:bg-canvas hover:text-ink sm:ml-0"
        aria-label={
          unread > 0 ? `Notifications (${unread} non lues)` : "Notifications"
        }
      >
        <Bell size={17} />
        {unread > 0 && (
          <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-danger ring-2 ring-surface" />
        )}
      </button>

      <button
        type="button"
        className="grid size-8 place-items-center rounded-lg text-ink-soft transition-colors hover:bg-canvas hover:text-ink"
        aria-label="Aide"
      >
        <CircleQuestionMark size={17} />
      </button>

      <InviteButton />
    </header>
  );
}
