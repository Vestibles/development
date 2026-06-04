"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "./Button";

interface DeleteButtonProps {
  onDelete: () => void;
  label?: string;
  className?: string;
}

export function DeleteButton({
  onDelete,
  label = "Delete",
  className = "",
}: DeleteButtonProps) {
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <div className={`flex flex-wrap items-center gap-2 ${className}`}>
        <Button
          variant="danger"
          className="min-h-10 px-3 py-2 text-sm"
          onClick={() => {
            onDelete();
            setConfirming(false);
          }}
        >
          Confirm {label.toLowerCase()}
        </Button>
        <Button
          variant="secondary"
          className="min-h-10 px-3 py-2 text-sm"
          onClick={() => setConfirming(false)}
        >
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      className={`inline-flex min-h-10 items-center gap-1.5 rounded-xl px-3 py-2 text-sm text-[var(--color-muted)] transition hover:bg-[var(--color-coral)]/10 hover:text-[var(--color-coral)] ${className}`}
      aria-label={label}
    >
      <Trash2 className="h-4 w-4" aria-hidden />
      <span>{label}</span>
    </button>
  );
}
