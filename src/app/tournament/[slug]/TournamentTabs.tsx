"use client";

import { useState } from "react";
import { Tabs, Tab, Chip } from "@heroui/react";
import {
  TrophyIcon,
  ClipboardDocumentListIcon,
  TableCellsIcon,
  MegaphoneIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";
import type {
  Tournament,
  Team,
  GameWithJoins,
  Announcement,
} from "@/lib/types/database";
import BracketTab from "./tabs/BracketTab";
import DraftTab, { type DraftPick } from "./tabs/DraftTab";
import RulesTab from "./tabs/RulesTab";
import AnnouncementsTab from "./tabs/AnnouncementsTab";
import GamesTab from "./tabs/GamesTab";

interface TournamentTabsProps {
  tournament: Tournament;
  teams: Team[];
  games: GameWithJoins[];
  announcements: Announcement[];
  draftPicks: DraftPick[];
}

export default function TournamentTabs({
  tournament,
  teams,
  games,
  announcements,
  draftPicks,
}: TournamentTabsProps) {
  const [selected, setSelected] = useState("bracket");

  const publishedAnnouncements = announcements.filter(
    (a) => a.published_at && a.audience === "all",
  );

  return (
    <div className="w-full">
      <Tabs
        selectedKey={selected}
        onSelectionChange={(key) => setSelected(key as string)}
        variant="underlined"
        color="primary"
        size="lg"
        classNames={{
          base: "w-full",
          tabList:
            "w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 gap-0 border-b border-white/5 bg-transparent overflow-x-auto",
          tab: "px-4 py-3 text-sm font-medium text-gray-400 data-[selected=true]:text-brand-teal data-[hover=true]:text-white transition-colors",
          cursor: "bg-brand-teal",
          panel: "pt-0",
        }}
      >
        <Tab
          key="bracket"
          title={
            <div className="flex items-center gap-2">
              <TrophyIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Bracket</span>
            </div>
          }
        >
          <BracketTab tournament={tournament} teams={teams} games={games} />
        </Tab>

        <Tab
          key="draft"
          title={
            <div className="flex items-center gap-2">
              <TableCellsIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Draft</span>
            </div>
          }
        >
          <DraftTab
            tournament={tournament}
            teams={teams}
            draftPicks={draftPicks}
          />
        </Tab>

        <Tab
          key="rules"
          title={
            <div className="flex items-center gap-2">
              <ClipboardDocumentListIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Rules</span>
            </div>
          }
        >
          <RulesTab tournament={tournament} />
        </Tab>

        <Tab
          key="announcements"
          title={
            <div className="flex items-center gap-2">
              <MegaphoneIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Announcements</span>
              {publishedAnnouncements.length > 0 && (
                <Chip size="sm" variant="flat" color="primary" className="ml-1">
                  {publishedAnnouncements.length}
                </Chip>
              )}
            </div>
          }
        >
          <AnnouncementsTab announcements={publishedAnnouncements} />
        </Tab>

        <Tab
          key="games"
          title={
            <div className="flex items-center gap-2">
              <CalendarDaysIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Games</span>
              {games.length > 0 && (
                <Chip size="sm" variant="flat" color="primary" className="ml-1">
                  {games.length}
                </Chip>
              )}
            </div>
          }
        >
          <GamesTab tournament={tournament} games={games} />
        </Tab>
      </Tabs>
    </div>
  );
}
