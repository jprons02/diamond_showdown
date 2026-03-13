"use client";

import { Select, SelectItem } from "@heroui/react";
import type { Tournament } from "@/lib/types/database";

interface TournamentSelectorProps {
  tournaments: Tournament[];
  selectedId: string;
  onChange: (id: string) => void;
  className?: string;
}

export function TournamentSelector({
  tournaments,
  selectedId,
  onChange,
  className = "w-full sm:w-80",
}: TournamentSelectorProps) {
  return (
    <Select
      aria-label="Select tournament"
      variant="bordered"
      className={className}
      selectedKeys={selectedId ? [selectedId] : []}
      onSelectionChange={(keys) => onChange(Array.from(keys)[0] as string)}
      classNames={{
        trigger:
          "flex items-center bg-white/5 border-white/10 rounded-xl data-[focus=true]:border-brand-teal/50 data-[hover=true]:bg-white/8 h-[42px]",
        value: "text-white text-sm whitespace-normal",
        popoverContent: "bg-brand-charcoal border border-white/10",
        listbox: "text-white",
        listboxWrapper: "max-h-64",
        selectorIcon: "text-gray-400 shrink-0",
      }}
    >
      {tournaments.map((t) => (
        <SelectItem key={t.id} classNames={{ title: "whitespace-normal" }}>
          {t.name}
        </SelectItem>
      ))}
    </Select>
  );
}
