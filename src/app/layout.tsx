import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import PublicShell from "@/components/PublicShell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Diamond Showdown | Softball Tournament",
    template: "%s | Diamond Showdown",
  },
  description:
    "Step Up to the Plate. Claim the Diamond. Register your team or sign up as a free agent for the ultimate softball tournament experience.",
  keywords: [
    "softball tournament",
    "Diamond Showdown",
    "softball registration",
    "team sports",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0F0F1A] text-white min-h-screen flex flex-col`}
      >
        <Providers>
          <PublicShell>{children}</PublicShell>
        </Providers>
      </body>
    </html>
  );
}
