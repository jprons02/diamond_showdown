"use client";

import { useState } from "react";
import { FireIcon } from "@heroicons/react/24/outline";
import { Button } from "@heroui/react";
import TournamentPickerDialog from "@/components/TournamentPickerDialog";

interface RegisterButtonProps {
  className?: string;
  children?: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

export default function RegisterButton({
  className,
  children,
  size,
}: RegisterButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onPress={() => setIsOpen(true)} className={className} size={size}>
        {children ?? (
          <>
            <FireIcon className="w-5 h-5 mr-2 group-hover:animate-bounce" />
            Register Now
          </>
        )}
      </Button>
      <TournamentPickerDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
