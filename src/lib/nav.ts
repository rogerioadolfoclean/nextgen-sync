import {
  House,
  Video,
  Radio,
  CirclePlay,
  MessageSquare,
  PenLine,
  ChartNoAxesColumn,
  Settings,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

/** Les 8 entrees de la sidebar, dans l'ordre exact du mockup. */
export const NAV_ITEMS: NavItem[] = [
  { href: "/accueil", label: "Accueil", icon: House },
  { href: "/reunions", label: "Réunions", icon: Video },
  { href: "/webinaires", label: "Webinaires", icon: Radio },
  { href: "/enregistrements", label: "Enregistrements", icon: CirclePlay },
  { href: "/messages-video", label: "Messages vidéo", icon: MessageSquare },
  { href: "/tableau-blanc", label: "Tableau blanc", icon: PenLine },
  { href: "/rapports", label: "Rapports", icon: ChartNoAxesColumn },
  { href: "/parametres", label: "Paramètres", icon: Settings },
];
