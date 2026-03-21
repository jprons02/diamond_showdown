"use client";

import Link from "next/link";
import { Button } from "@heroui/react";
import {
  XMarkIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";

interface DialogShellProps {
  title: string;
  onClose: () => void;
  fullPageHref?: string;
  wide?: boolean;
  children: React.ReactNode;
}

export function DialogShell({
  title,
  onClose,
  fullPageHref,
  wide,
  children,
}: DialogShellProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-12 px-4">
      <div className="fixed inset-0 bg-black/60" onClick={onClose} />
      <div
        className={`relative bg-brand-surface border border-white/10 rounded-2xl w-full ${wide ? "max-w-3xl" : "max-w-lg"} max-h-[85vh] overflow-y-auto p-6`}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <div className="flex items-center gap-2">
            {fullPageHref && (
              <Link
                href={fullPageHref}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-brand-teal transition-colors"
              >
                Full page
                <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5" />
              </Link>
            )}
            <Button isIconOnly variant="light" onPress={onClose}>
              <XMarkIcon className="w-5 h-5" />
            </Button>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
