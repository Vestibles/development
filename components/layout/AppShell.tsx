"use client";

import Link from "next/link";
import { BottomNav } from "./BottomNav";
import { useEvent } from "@/lib/context/EventContext";
import { Church, Settings } from "lucide-react";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { data, loading, usingSupabase, syncError } = useEvent();

  return (
    <div className="mx-auto min-h-dvh max-w-lg pb-24">
      <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-cream)]/95 px-4 py-3 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--color-sage)]/20 text-[var(--color-sage-dark)]">
            <Church className="h-6 w-6" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium uppercase tracking-wide text-[var(--color-muted)]">
              Fun Day Planner
            </p>
            <p className="truncate text-base font-semibold">
              {loading ? "Loading…" : data.event.name}
            </p>
          </div>
          <Link
            href="/settings"
            className="flex h-11 w-11 items-center justify-center rounded-xl text-[var(--color-sage-dark)] hover:bg-[var(--color-sage)]/15"
            aria-label="Event settings"
          >
            <Settings className="h-5 w-5" />
          </Link>
          {usingSupabase ? (
            <span className="rounded-full bg-[var(--color-sky)]/20 px-2 py-1 text-[10px] font-medium text-[#4a8fad]">
              Cloud
            </span>
          ) : (
            <span className="rounded-full bg-[var(--color-lavender)]/20 px-2 py-1 text-[10px] font-medium text-[#6b5b8a]">
              Demo
            </span>
          )}
        </div>
        {syncError ? (
          <p className="mt-2 text-xs text-[var(--color-coral)]">
            Save failed — check connection. Local copy kept.
          </p>
        ) : null}
      </header>
      <main className="px-4 py-5">{children}</main>
      <BottomNav />
    </div>
  );
}
