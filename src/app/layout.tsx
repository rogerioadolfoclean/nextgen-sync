import type { Metadata, Viewport } from "next";
import { Inter, Caveat } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Le tableau blanc du mockup est ecrit a la main : cette police porte les
// cartes, le noeud central et les annotations.
const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "NextGen Sync — Visioconférence & collaboration unifiée",
  description:
    "Réunions HD, tableau blanc collaboratif, sous-titres et traduction IA, webinaires, sondages et enregistrements — réunis dans une seule plateforme.",
  applicationName: "NextGen Sync",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "NextGen Sync",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  themeColor: "#111a27",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${inter.variable} ${caveat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
