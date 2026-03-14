"use client";

import { useState } from "react";
import { FireIcon } from "@heroicons/react/24/outline";
import TournamentPickerDialog from "@/components/TournamentPickerDialog";

interface RegisterButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export default function RegisterButton({
  className,
  children,
}: RegisterButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)} className={className}>
        {children ?? (
          <>
            <FireIcon className="w-5 h-5 mr-2 group-hover:animate-bounce" />
            Register Now
          </>
        )}
      </button>
      <TournamentPickerDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
