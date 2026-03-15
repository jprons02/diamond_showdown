"use client";

import { Button } from "@heroui/react";
import Link from "next/link";

interface GlassButtonProps {
  href: string;
  className?: string;
  children: React.ReactNode;
}

export default function GlassButton({
  href,
  className,
  children,
}: GlassButtonProps) {
  return (
    <Button as={Link} href={href} className={className}>
      {children}
    </Button>
  );
}
