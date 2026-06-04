import type { LucideIcon } from "lucide-react";
import { Card } from "./Card";

interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  icon: LucideIcon;
  accent?: "sage" | "sky" | "lavender" | "coral";
}

const accents = {
  sage: "bg-[var(--color-sage)]/15 text-[var(--color-sage-dark)]",
  sky: "bg-[var(--color-sky)]/20 text-[#4a8fad]",
  lavender: "bg-[var(--color-lavender)]/20 text-[#6b5b8a]",
  coral: "bg-[var(--color-coral)]/25 text-[#b07068]",
};

export function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  accent = "sage",
}: StatCardProps) {
  return (
    <Card padding="md" className="flex flex-col gap-2">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm text-[var(--color-muted)]">{label}</p>
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${accents[accent]}`}
        >
          <Icon className="h-5 w-5" aria-hidden />
        </span>
      </div>
      <p className="text-2xl font-semibold tracking-tight">{value}</p>
      {sub ? <p className="text-xs text-[var(--color-muted)]">{sub}</p> : null}
    </Card>
  );
}
