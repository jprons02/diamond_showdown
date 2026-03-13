"use client";

import { MegaphoneIcon } from "@heroicons/react/24/outline";
import type { Announcement } from "@/lib/types/database";

interface AnnouncementsTabProps {
  announcements: Announcement[];
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default function AnnouncementsTab({
  announcements,
}: AnnouncementsTabProps) {
  if (announcements.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-6">
          <MegaphoneIcon className="w-8 h-8 text-gray-600" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">
          No Announcements Yet
        </h2>
        <p className="text-gray-400 max-w-md mx-auto">
          Announcements from the tournament organizers will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-4">
        {announcements.map((a) => (
          <div
            key={a.id}
            className="rounded-2xl border border-white/5 bg-brand-surface/50 p-5 sm:p-6 hover:border-brand-teal/20 transition-all duration-300"
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <h3 className="text-base font-bold text-white">{a.title}</h3>
              {a.published_at && (
                <span className="text-xs text-gray-500 flex-shrink-0">
                  {timeAgo(a.published_at)}
                </span>
              )}
            </div>
            {a.body && (
              <p className="text-sm text-gray-400 leading-relaxed">{a.body}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
