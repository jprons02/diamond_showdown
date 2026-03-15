"use client";

import { Button } from "@heroui/react";
import Link from "next/link";

interface GlassButtonProps {
  href: string;
  className?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

export default function GlassButton({
  href,
  className,
  children,
  size,
}: GlassButtonProps) {
  return (
    <Button as={Link} href={href} className={className} size={size}>
      {children}
    </Button>
  );
}
