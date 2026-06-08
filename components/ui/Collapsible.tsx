"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

interface CollapsibleProps {
  title: ReactNode;
  subtitle?: ReactNode;
  defaultOpen?: boolean;
  children: ReactNode;
  className?: string;
  padding?: "sm" | "md";
}

export function Collapsible({
  title,
  subtitle,
  defaultOpen = false,
  children,
  className = "",
  padding = "md",
}: CollapsibleProps) {
  const [open, setOpen] = useState(defaultOpen);
  const pad = padding === "sm" ? "p-3" : "p-4";

  return (
    <div
      className={`rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] shadow-sm ${className}`}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex w-full items-center gap-3 text-left ${pad}`}
        aria-expanded={open}
      >
        <div className="min-w-0 flex-1">
          <div className="font-semibold">{title}</div>
          {subtitle ? (
            <div className="mt-0.5 text-xs text-[var(--color-muted)]">
              {subtitle}
            </div>
          ) : null}
        </div>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-[var(--color-muted)] transition ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>
      {open ? (
        <div className={`border-t border-[var(--color-border)] ${pad} pt-3`}>
          {children}
        </div>
      ) : null}
    </div>
  );
}
