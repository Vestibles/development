"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCurrency } from "@/lib/calculations";
import type { DashboardSummary } from "@/lib/types";
import { Card } from "../ui/Card";

interface RevenueChartProps {
  summary: DashboardSummary;
}

export function RevenueChart({ summary }: RevenueChartProps) {
  const data = [
    { name: "Stalls", value: summary.stallRevenue },
    { name: "Tickets", value: summary.ticketRevenue },
    { name: "Donations", value: summary.donationTotal },
  ];

  return (
    <Card>
      <h2 className="mb-3 text-sm font-semibold">Revenue breakdown</h2>
      <div className="h-52 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e8e4df" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis
              tick={{ fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `£${v}`}
            />
            <Tooltip
              formatter={(value: number) => [formatCurrency(value), "Amount"]}
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #e8e4df",
              }}
            />
            <Bar dataKey="value" fill="var(--color-sage)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
