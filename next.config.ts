import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // L'indicateur se place en bas a gauche par defaut, pile sur la carte
  // profil de la sidebar : on le deplace pour garder l'ecran conforme au mockup.
  devIndicators: {
    position: "bottom-right",
  },
};

export default nextConfig;
