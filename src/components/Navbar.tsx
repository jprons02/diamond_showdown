"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Navbar as HeroNavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Button,
} from "@heroui/react";
import { brand } from "@/lib/brand";
import TournamentPickerDialog from "@/components/TournamentPickerDialog";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Tournament", href: "/tournament" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const pathname = usePathname();

  return (
    <HeroNavbar
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      maxWidth="xl"
      className="bg-brand-dark/80 backdrop-blur-xl border-b border-white/5"
      height="4.5rem"
    >
      {/* Mobile menu toggle */}
      <NavbarContent className="md:hidden" justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="text-white"
        />
      </NavbarContent>

      {/* Brand */}
      <NavbarContent className="hidden md:flex" justify="start">
        <NavbarBrand as={Link} href="/" className="gap-3 cursor-pointer">
          <Image
            src="/logo.png"
            alt={`${brand.name} Logo`}
            width={75}
            height={75}
            className="rounded-lg"
            priority
          />
          {/*
          <span className="font-bold text-lg text-white hidden md:block">
            {brand.name}
          </span>
          */}
        </NavbarBrand>
      </NavbarContent>

      {/* Desktop nav */}
      <NavbarContent className="hidden md:flex gap-6" justify="center">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <NavbarItem key={item.href} isActive={isActive}>
              <Link
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  isActive
                    ? "text-brand-teal"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            </NavbarItem>
          );
        })}
      </NavbarContent>

      {/* CTA */}
      <NavbarContent justify="end" className="gap-5">
        {/* Mobile: logo sits next to the button */}
        <NavbarItem className="flex md:hidden">
          <Link href="/">
            <Image
              src="/logo.png"
              alt={`${brand.name} Logo`}
              width={60}
              height={60}
              className="rounded-lg"
            />
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Button
            color="primary"
            variant="shadow"
            size="sm"
            className="font-semibold bg-gradient-brand text-white"
            onPress={() => setIsPickerOpen(true)}
          >
            Register Now
          </Button>
        </NavbarItem>
      </NavbarContent>

      {/* Mobile menu */}
      <NavbarMenu className="bg-brand-dark/95 backdrop-blur-xl pt-6">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <NavbarMenuItem key={item.href}>
              <Link
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={`block w-full py-3 text-lg font-medium transition-colors ${
                  isActive
                    ? "text-brand-teal"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          );
        })}
        <NavbarMenuItem>
          <Button
            color="primary"
            variant="shadow"
            className="w-full mt-4 font-semibold bg-gradient-brand text-white"
            onPress={() => {
              setIsMenuOpen(false);
              setIsPickerOpen(true);
            }}
          >
            Register Now
          </Button>
        </NavbarMenuItem>
      </NavbarMenu>

      <TournamentPickerDialog
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
      />
    </HeroNavbar>
  );
}
