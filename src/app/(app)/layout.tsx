import { Sidebar } from "@/components/sidebar";
import { TopBar } from "@/components/topbar";
import { MobileTabBar } from "@/components/mobile-tabbar";
import { getSessionUser } from "@/lib/session";
import { IdentityGate } from "@/components/identity-gate";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();

  return (
    <IdentityGate>
    <div className="flex h-dvh overflow-hidden bg-canvas">
      <div className="hidden md:flex">
        <Sidebar
          user={{ name: user.name, role: user.role, avatarUrl: user.avatarUrl }}
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Barre du haut du site PC ; le mobile a son propre en-tete par onglet. */}
        <div className="hidden md:flex md:flex-col">
          <TopBar unread={user.unreadCount} />
        </div>

        <main className="scroll-clean flex-1 overflow-y-auto">{children}</main>

        <MobileTabBar />
      </div>
    </div>
    </IdentityGate>
  );
}
