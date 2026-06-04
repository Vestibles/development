"use client";

import { useState } from "react";
import { Trash2, X } from "lucide-react";

interface IconDeleteProps {
  onDelete: () => void;
  itemName?: string;
}

export function IconDelete({ onDelete, itemName = "item" }: IconDeleteProps) {
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={onDelete}
          className="rounded-lg bg-[var(--color-coral)] px-2 py-1 text-xs font-medium text-white"
        >
          Yes
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="rounded-lg p-1 text-[var(--color-muted)]"
          aria-label="Cancel delete"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      className="rounded-lg p-2 text-[var(--color-muted)] hover:bg-[var(--color-coral)]/10 hover:text-[var(--color-coral)]"
      aria-label={`Delete ${itemName}`}
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
