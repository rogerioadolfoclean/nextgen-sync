"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, Video, MessageSquare, CirclePlay, User } from "lucide-react";

/** Les 5 onglets du bas de l'app mobile, dans l'ordre du mockup. */
const TABS = [
  { href: "/accueil", label: "Accueil", icon: House },
  { href: "/reunions", label: "Réunions", icon: Video },
  { href: "/messages-video", label: "Messages", icon: MessageSquare },
  { href: "/enregistrements", label: "Enregistrements", icon: CirclePlay },
  { href: "/parametres", label: "Profil", icon: User },
];

export function MobileTabBar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navigation"
      className="flex shrink-0 items-stretch border-t border-hairline bg-surface pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      {TABS.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`flex flex-1 flex-col items-center gap-0.5 py-2 ${
              active ? "text-primary" : "text-ink-soft"
            }`}
          >
            <Icon size={19} fill={active ? "currentColor" : "none"} />
            <span className="text-[9.5px] font-medium">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
