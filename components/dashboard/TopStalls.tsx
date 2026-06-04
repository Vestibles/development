import { formatCurrency, formatPercent } from "@/lib/calculations";
import type { StallMetrics } from "@/lib/types";
import { Card } from "../ui/Card";
import { Trophy } from "lucide-react";

interface TopStallsProps {
  stalls: StallMetrics[];
}

export function TopStalls({ stalls }: TopStallsProps) {
  if (stalls.length === 0) {
    return (
      <Card>
        <p className="text-sm text-[var(--color-muted)]">No stalls yet.</p>
      </Card>
    );
  }

  return (
    <Card>
      <div className="mb-3 flex items-center gap-2">
        <Trophy className="h-5 w-5 text-[var(--color-sage-dark)]" aria-hidden />
        <h2 className="text-sm font-semibold">Best performing stalls</h2>
      </div>
      <ul className="space-y-3">
        {stalls.map((stall, i) => (
          <li
            key={stall.id}
            className="flex items-center justify-between gap-2 border-b border-[var(--color-border)] pb-3 last:border-0 last:pb-0"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-sage)]/15 text-sm font-semibold text-[var(--color-sage-dark)]">
                {i + 1}
              </span>
              <div className="min-w-0">
                <p className="truncate font-medium">{stall.name}</p>
                <p className="text-xs text-[var(--color-muted)]">
                  {formatPercent(stall.marginPercent)} margin · {stall.units} units
                </p>
              </div>
            </div>
            <p className="shrink-0 font-semibold text-[var(--color-sage-dark)]">
              {formatCurrency(stall.profit)}
            </p>
          </li>
        ))}
      </ul>
    </Card>
  );
}
