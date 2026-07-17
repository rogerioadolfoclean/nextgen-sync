"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { NAV_ITEMS } from "@/lib/nav";
import { Logo } from "./logo";
import { Avatar } from "./avatar";

export type SidebarUser = {
  name: string;
  role: string;
  avatarUrl?: string | null;
};

export function Sidebar({ user }: { user: SidebarUser }) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-[248px] shrink-0 flex-col bg-navy">
      <div className="border-b border-white/10 px-4 pt-5 pb-4">
        <Link href="/accueil" aria-label="NextGen Sync — accueil">
          <Logo />
        </Link>
      </div>

      <nav
        className="flex-1 space-y-0.5 px-3 pt-3"
        aria-label="Navigation principale"
      >
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13.5px] transition-colors ${
                active
                  ? "bg-navy-pill font-semibold text-white"
                  : "font-medium text-navy-muted hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon
                size={17}
                strokeWidth={active ? 2.2 : 2}
                fill={active ? "currentColor" : "none"}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-white/10 p-3">
        <Link
          href="/parametres"
          className="flex items-center gap-2.5 rounded-lg px-2 py-2 transition-colors hover:bg-white/5"
        >
          <Avatar name={user.name} src={user.avatarUrl} size={30} />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[12.5px] font-semibold text-white">
              {user.name}
            </span>
            <span className="block truncate text-[11px] text-navy-muted">
              {user.role}
            </span>
          </span>
          <ChevronRight size={15} className="shrink-0 text-navy-muted" />
        </Link>
      </div>
    </aside>
  );
}
