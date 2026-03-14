"use client";

import { Breadcrumbs, BreadcrumbItem } from "@heroui/react";

export default function TournamentBreadcrumb({ name }: { name: string }) {
  return (
    <Breadcrumbs
      className="mb-4"
      itemClasses={{
        item: "text-gray-500 data-[current=true]:text-gray-300 text-sm",
        separator: "text-gray-600",
      }}
    >
      <BreadcrumbItem href="/tournament">Tournaments</BreadcrumbItem>
      <BreadcrumbItem isCurrent>{name}</BreadcrumbItem>
    </Breadcrumbs>
  );
}
