"use client";

import { useState } from "react";
import {
  FileSpreadsheet,
  Sheet,
  ClipboardCopy,
  Check,
  Download,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  copyForGoogleSheets,
  downloadCsv,
  downloadExcel,
  EXPORT_SCOPE_LABELS,
  type ExportScope,
} from "@/lib/export/spreadsheet";
import type { AppData } from "@/lib/types";

interface ExportPanelProps {
  data: AppData;
  /** Which dataset to export; defaults to full workbook */
  scope?: ExportScope;
  /** Compact: single row of actions. Full: descriptions + all format buttons */
  variant?: "compact" | "full";
  title?: string;
}

export function ExportPanel({
  data,
  scope = "all",
  variant = "full",
  title = "Export data",
}: ExportPanelProps) {
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const label = EXPORT_SCOPE_LABELS[scope];

  async function run(action: string, fn: () => void | Promise<void>) {
    setBusy(action);
    try {
      await fn();
    } finally {
      setTimeout(() => setBusy(null), 400);
    }
  }

  if (variant === "compact") {
    return (
      <div className="flex flex-wrap gap-2">
        <Button
          variant="secondary"
          className="min-h-11 flex-1 text-sm"
          disabled={!!busy}
          onClick={() => run("excel", () => void downloadExcel(data, scope))}
        >
          <FileSpreadsheet className="h-4 w-4" aria-hidden />
          Excel
        </Button>
        <Button
          variant="secondary"
          className="min-h-11 flex-1 text-sm"
          disabled={!!busy}
          onClick={() => run("csv", () => void downloadCsv(data, scope))}
        >
          <Sheet className="h-4 w-4" aria-hidden />
          CSV
        </Button>
      </div>
    );
  }

  return (
    <Card className="space-y-4">
      <div>
        <h2 className="flex items-center gap-2 text-sm font-semibold">
          <Download className="h-4 w-4 text-[var(--color-sage-dark)]" aria-hidden />
          {title}
        </h2>
        <p className="mt-1 text-xs text-[var(--color-muted)]">
          Export <strong>{label}</strong> for Excel, or import CSV / Excel into
          Google Sheets (File → Import → Upload).
        </p>
      </div>

      <div className="space-y-2">
        <Button
          fullWidth
          disabled={!!busy}
          onClick={() => run("excel", () => void downloadExcel(data, scope))}
        >
          <FileSpreadsheet className="h-5 w-5" aria-hidden />
          Download Excel (.xlsx)
        </Button>
        <Button
          variant="secondary"
          fullWidth
          disabled={!!busy}
          onClick={() => run("csv", () => void downloadCsv(data, scope))}
        >
          <Sheet className="h-5 w-5" aria-hidden />
          {scope === "all"
            ? "Download CSV files (Google Sheets)"
            : "Download CSV (Google Sheets)"}
        </Button>
        {scope === "all" || scope === "summary" ? (
          <Button
            variant="secondary"
            fullWidth
            disabled={!!busy}
            onClick={() =>
              run("copy", async () => {
                await copyForGoogleSheets(data);
                setCopied(true);
                setTimeout(() => setCopied(false), 2500);
              })
            }
          >
            {copied ? (
              <Check className="h-5 w-5 text-[var(--color-sage)]" aria-hidden />
            ) : (
              <ClipboardCopy className="h-5 w-5" aria-hidden />
            )}
            {copied ? "Copied — paste into Google Sheets" : "Copy summary for Google Sheets"}
          </Button>
        ) : null}
      </div>

      <p className="text-[10px] leading-relaxed text-[var(--color-muted)]">
        Tip: In Google Sheets, use File → Import → Upload and choose your .xlsx or
        .csv file. For a full report, prefer the Excel workbook (multiple tabs).
      </p>
    </Card>
  );
}
