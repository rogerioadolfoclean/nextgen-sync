/**
 * Manifeste PWA — permet d'installer NextGen Sync sur iOS et Android depuis le
 * navigateur, comme les ecrans "APP MOBILE" du mockup.
 */
export function GET() {
  return Response.json({
    name: "NextGen Sync",
    short_name: "NextGen Sync",
    description:
      "Réunions HD, tableau blanc collaboratif, sous-titres et traduction IA, webinaires et enregistrements.",
    id: "/accueil",
    start_url: "/accueil",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#f9f9fb",
    theme_color: "#111a27",
    lang: "fr",
    categories: ["business", "productivity"],
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  });
}
