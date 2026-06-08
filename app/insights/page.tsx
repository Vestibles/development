"use client";

import {
  AlertTriangle,
  Lightbulb,
  Package,
  Sparkles,
  Tag,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useEvent } from "@/lib/context/EventContext";
import { generateInsights } from "@/lib/insights";
import { formatCurrency } from "@/lib/calculations";
import { rankStallsByProfit } from "@/lib/insights";

const typeIcons = {
  pricing: Tag,
  warning: AlertTriangle,
  stock: Package,
  tip: Lightbulb,
};

const priorityStyles = {
  high: "border-l-4 border-[var(--color-coral)]",
  medium: "border-l-4 border-amber-400",
  low: "border-l-4 border-[var(--color-sage)]",
};

export default function InsightsPage() {
  const { data, resetToSeed } = useEvent();
  const insights = generateInsights(
    data.stalls,
    data.event.attendance_estimate
  );
  const ranked = rankStallsByProfit(data.stalls);

  return (
    <div className="space-y-5">
      <PageHeader
        title="AI insights"
        subtitle="Pricing tips, stock estimates, and stall performance"
      />

      <Card className="flex items-start gap-3 bg-[var(--color-lavender)]/10">
        <Sparkles className="h-6 w-6 shrink-0 text-[var(--color-lavender-dark)]" aria-hidden />
        <p className="text-sm text-[var(--color-muted)]">
          Smart suggestions based on your stall margins, attendance estimate,
          and planned quantities. Review with your team before making changes.
        </p>
      </Card>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold">Recommendations</h2>
        {insights.length === 0 ? (
          <Card>
            <p className="text-sm text-[var(--color-muted)]">
              Everything looks balanced. Keep monitoring sales on the day.
            </p>
          </Card>
        ) : (
          insights.map((insight) => {
            const Icon = typeIcons[insight.type];
            return (
              <Card
                key={insight.id}
                className={priorityStyles[insight.priority]}
              >
                <div className="flex gap-3">
                  <Icon className="h-5 w-5 shrink-0 text-[var(--color-sage-dark)]" />
                  <div>
                    <p className="font-medium">{insight.title}</p>
                    <p className="mt-1 text-sm text-[var(--color-muted)]">
                      {insight.message}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </section>

      <section>
        <h2 className="mb-2 text-sm font-semibold">Stall profit ranking</h2>
        <Card>
          <ul className="space-y-2">
            {ranked.map((s, i) => (
              <li
                key={s.id}
                className="flex justify-between text-sm border-b border-[var(--color-border)] pb-2 last:border-0"
              >
                <span>
                  {i + 1}. {s.name}
                </span>
                <span className="font-semibold">{formatCurrency(s.profit)}</span>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      <Button variant="secondary" fullWidth onClick={resetToSeed}>
        Reset to sample data
      </Button>
    </div>
  );
}
