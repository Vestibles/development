"use client";

import {
  TrendingUp,
  Wallet,
  PiggyBank,
  Users,
} from "lucide-react";
import { ProfitChart } from "@/components/dashboard/ProfitChart";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { TopStalls } from "@/components/dashboard/TopStalls";
import { StatCard } from "@/components/ui/StatCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Field } from "@/components/ui/Field";
import { ExportPanel } from "@/components/export/ExportPanel";
import { useEvent } from "@/lib/context/EventContext";
import {
  formatCurrency,
  formatPercent,
} from "@/lib/calculations";

export default function DashboardPage() {
  const { summary, data, updateEvent, loading } = useEvent();

  if (loading) {
    return <p className="text-center text-[var(--color-muted)]">Loading your event…</p>;
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Dashboard"
        subtitle="Overview — tap the gear icon to edit event details"
      />

      <div className="grid grid-cols-2 gap-3">
        <StatCard
          label="Expected revenue"
          value={formatCurrency(summary.expectedRevenue)}
          icon={TrendingUp}
          accent="sage"
        />
        <StatCard
          label="Expected expenses"
          value={formatCurrency(summary.expectedExpenses)}
          icon={Wallet}
          accent="coral"
        />
        <StatCard
          label="Projected profit"
          value={formatCurrency(summary.projectedProfit)}
          sub={`${formatPercent(summary.marginPercent)} overall margin`}
          icon={PiggyBank}
          accent="lavender"
        />
        <StatCard
          label="Attendance"
          value={String(summary.attendanceEstimate)}
          sub="estimated guests"
          icon={Users}
          accent="sky"
        />
      </div>

      <Card>
        <Field
          label="Attendance estimate"
          type="number"
          min={0}
          value={data.event.attendance_estimate}
          onChange={(e) =>
            updateEvent({ attendance_estimate: Number(e.target.value) || 0 })
          }
        />
      </Card>

      <RevenueChart summary={summary} />
      <ProfitChart
        revenue={summary.expectedRevenue}
        expenses={summary.expectedExpenses}
        profit={summary.projectedProfit}
      />
      <TopStalls stalls={summary.topStalls} />

      <ExportPanel
        data={data}
        scope="summary"
        title="Export dashboard"
        variant="full"
      />
    </div>
  );
}
