"use client";

import {
  ClipboardDocumentListIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import type { Tournament } from "@/lib/types/database";

interface RulesTabProps {
  tournament: Tournament;
}

export default function RulesTab({ tournament }: RulesTabProps) {
  if (!tournament.rules_text) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-6">
          <ClipboardDocumentListIcon className="w-8 h-8 text-gray-600" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">
          Rules Not Yet Published
        </h2>
        <p className="text-gray-400 max-w-md mx-auto">
          Tournament-specific rules will be posted here once they are finalized.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="rounded-2xl border border-white/5 bg-brand-surface/50 p-6 sm:p-8">
        <div className="prose prose-invert prose-sm max-w-none">
          {/* Render rules_text — split paragraphs on double newlines */}
          {tournament.rules_text.split(/\n\n+/).map((paragraph, idx) => (
            <p key={idx} className="text-gray-300 leading-relaxed mb-4">
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-8 p-5 rounded-2xl bg-yellow-500/5 border border-yellow-500/20">
        <div className="flex items-start gap-3">
          <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-yellow-500 text-sm mb-1">
              Disclaimer
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Tournament organizers reserve the right to modify these rules at
              any time. Changes will be communicated to registered players. All
              decisions by tournament officials are final.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
