"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@heroui/react";
import { useTournament } from "@/components/admin/TournamentContext";
import { TournamentSelector } from "@/components/admin/TournamentSelector";
import {
  HomeIcon,
  TrophyIcon,
  UserGroupIcon,
  PlayIcon,
  MegaphoneIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronLeftIcon,
  ArrowRightOnRectangleIcon,
  RocketLaunchIcon,
} from "@heroicons/react/24/outline";

const navSections = [
  {
    heading: null,
    items: [
      { label: "Dashboard", href: "/admin", icon: HomeIcon },
      { label: "Wizard", href: "/admin/wizard", icon: RocketLaunchIcon },
    ],
  },
  {
    heading: "Game Day",
    items: [
      { label: "Check-In", href: "/admin/check-in", icon: UserGroupIcon },
      { label: "Scores", href: "/admin/games", icon: PlayIcon },
      {
        label: "Announcements",
        href: "/admin/announcements",
        icon: MegaphoneIcon,
      },
    ],
  },
  {
    heading: "Manage",
    items: [
      { label: "Tournaments", href: "/admin/tournaments", icon: TrophyIcon },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { tournaments, selectedId, setSelectedId } = useTournament();

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  const sidebar = (
    <nav className="flex flex-col h-full">
      {/* Brand header */}
      <div className="px-5 py-5 border-b border-white/5">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-brand flex items-center justify-center">
            <span className="text-white font-bold text-sm">DS</span>
          </div>
          <span className="font-bold text-white text-lg">Admin</span>
        </Link>
      </div>

      {/* Tournament selector */}
      {tournaments.length > 0 && (
        <div className="px-4 py-3 border-b border-white/5">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-500 mb-1.5">
            Tournament
          </p>
          <TournamentSelector
            tournaments={tournaments}
            selectedId={selectedId}
            onChange={setSelectedId}
            className="w-full"
          />
        </div>
      )}

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {navSections.map((section, idx) => (
          <div key={idx}>
            {section.heading && (
              <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-widest text-gray-500">
                {section.heading}
              </p>
            )}
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                        active
                          ? "bg-brand-teal/10 text-brand-teal"
                          : "text-gray-400 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 shrink-0 ${active ? "text-brand-teal" : ""}`}
                      />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-white/5 space-y-1">
        <Button
          variant="light"
          color="danger"
          fullWidth
          className="justify-start"
          startContent={<ArrowRightOnRectangleIcon className="w-4 h-4" />}
          onPress={handleLogout}
        >
          Sign Out
        </Button>
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-gray-500 hover:text-white hover:bg-white/5 transition-colors"
        >
          <ChevronLeftIcon className="w-4 h-4" />
          Back to Site
        </Link>
      </div>
    </nav>
  );

  return (
    <>
      {/* Mobile toggle */}
      <Button
        isIconOnly
        variant="flat"
        onPress={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 md:hidden"
        aria-label="Open admin menu"
      >
        <Bars3Icon className="w-5 h-5" />
      </Button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-brand-surface border-r border-white/5 transform transition-transform duration-200 md:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Button
          isIconOnly
          variant="light"
          onPress={() => setMobileOpen(false)}
          className="absolute top-4 right-4"
          aria-label="Close menu"
        >
          <XMarkIcon className="w-5 h-5" />
        </Button>
        {sidebar}
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:flex-col md:w-64 md:shrink-0 bg-brand-surface border-r border-white/5 h-screen sticky top-0">
        {sidebar}
      </aside>
    </>
  );
}
