import { headers } from "next/headers";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { TournamentProvider } from "@/components/admin/TournamentContext";
import TournamentBanner from "@/components/admin/TournamentBanner";

export const dynamic = "force-dynamic";

export const metadata = {
  title: {
    default: "Admin | Diamond Showdown",
    template: "%s | Admin | Diamond Showdown",
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const isLoginPage = headersList.get("x-admin-login") === "1";

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <TournamentProvider>
      <div className="flex min-h-screen bg-[#0F0F1A]">
        <AdminSidebar />
        <main className="flex-1 min-h-screen overflow-x-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-6 md:py-8">
            <TournamentBanner />
            {children}
          </div>
        </main>
      </div>
    </TournamentProvider>
  );
}
