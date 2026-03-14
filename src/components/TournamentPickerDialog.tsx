"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Spinner,
} from "@heroui/react";
import {
  CalendarDaysIcon,
  MapPinIcon,
  TrophyIcon,
} from "@heroicons/react/24/outline";
import { ChevronRightIcon } from "@heroicons/react/24/solid";
import { createClient } from "@/lib/supabase/client";
import type { Tournament } from "@/lib/types/database";

function formatDate(dateStr: string | null) {
  if (!dateStr) return "TBD";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

interface TournamentPickerDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TournamentPickerDialog({
  isOpen,
  onClose,
}: TournamentPickerDialogProps) {
  const router = useRouter();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;

    let cancelled = false;
    setLoading(true);

    const supabase = createClient();
    supabase
      .from("tournaments")
      .select("*")
      .eq("status", "open")
      .order("event_date", { ascending: true })
      .then(({ data }) => {
        if (!cancelled) {
          setTournaments((data ?? []) as Tournament[]);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [isOpen]);

  const handleSelect = (slug: string) => {
    onClose();
    router.push(`/register/${slug}`);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      placement="center"
      backdrop="blur"
      classNames={{
        base: "bg-brand-surface border border-white/10",
        header: "border-b border-white/5",
        closeButton: "text-gray-400 hover:text-white",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h2 className="text-xl font-bold text-white">Choose a Tournament</h2>
          <p className="text-sm text-gray-400 font-normal">
            Select the tournament you&apos;d like to register for.
          </p>
        </ModalHeader>
        <ModalBody className="pb-6">
          {loading ? (
            <div className="flex justify-center py-10">
              <Spinner color="primary" size="lg" />
            </div>
          ) : tournaments.length === 0 ? (
            <div className="text-center py-10">
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                <TrophyIcon className="w-7 h-7 text-gray-600" />
              </div>
              <p className="text-white font-semibold mb-1">
                No Open Tournaments
              </p>
              <p className="text-sm text-gray-400">
                There are no tournaments accepting registrations right now.
                Check back soon!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {tournaments.map((t) => (
                <button
                  key={t.id}
                  onClick={() => handleSelect(t.slug)}
                  className="group w-full text-left rounded-xl border border-white/5 bg-white/[0.02] p-4 sm:p-5 transition-all duration-300 hover:border-brand-teal/30 hover:bg-brand-teal/5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-semibold text-white group-hover:text-brand-teal transition-colors truncate">
                        {t.name}
                      </h3>
                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                        <span className="inline-flex items-center gap-1.5 text-sm text-gray-400">
                          <CalendarDaysIcon className="w-4 h-4 text-brand-teal flex-shrink-0" />
                          {formatDate(t.event_date)}
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-sm text-gray-400">
                          <MapPinIcon className="w-4 h-4 text-brand-teal flex-shrink-0" />
                          {t.location_name || "Location TBD"}
                        </span>
                        {t.entry_fee != null && (
                          <span className="inline-flex items-center gap-1.5 text-sm text-gray-400">
                            <TrophyIcon className="w-4 h-4 text-brand-teal flex-shrink-0" />
                            ${Number(t.entry_fee).toFixed(0)} entry
                          </span>
                        )}
                      </div>
                    </div>
                    <ChevronRightIcon className="w-5 h-5 text-gray-600 group-hover:text-brand-teal group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
