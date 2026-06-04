"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Field } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { ExportPanel } from "@/components/export/ExportPanel";
import { useEvent } from "@/lib/context/EventContext";

export default function SettingsPage() {
  const { data, updateEvent, resetToSeed, usingSupabase, syncError } = useEvent();
  const { event } = data;

  return (
    <div className="space-y-5">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-[var(--color-sage-dark)]"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Back to dashboard
      </Link>

      <PageHeader
        title="Event settings"
        subtitle="Edit your fun day details"
      />

      {syncError ? (
        <Card className="border-[var(--color-coral)]/50 bg-[var(--color-coral)]/10">
          <p className="text-sm text-[var(--color-coral)]">
            Could not save to database: {syncError}
          </p>
        </Card>
      ) : null}

      <Card className="space-y-4">
        <Field
          label="Event name"
          value={event.name}
          onChange={(e) => updateEvent({ name: e.target.value })}
        />
        <Field
          label="Event date"
          type="date"
          value={event.event_date ?? ""}
          onChange={(e) =>
            updateEvent({ event_date: e.target.value || null })
          }
        />
        <Field
          label="Attendance estimate"
          type="number"
          min={0}
          value={event.attendance_estimate}
          onChange={(e) =>
            updateEvent({
              attendance_estimate: parseInt(e.target.value, 10) || 0,
            })
          }
        />
      </Card>

      <ExportPanel data={data} scope="all" title="Export everything" />

      <Card>
        <p className="text-sm text-[var(--color-muted)]">
          Storage: {usingSupabase ? "Supabase cloud database" : "Browser local storage (demo mode)"}
        </p>
        <p className="mt-2 text-xs text-[var(--color-muted)]">
          All changes on stalls, tickets, volunteers, and shopping are saved
          automatically when you edit fields or tap delete.
        </p>
      </Card>

      <Button variant="secondary" fullWidth onClick={resetToSeed}>
        Reset all data to sample
      </Button>
    </div>
  );
}
