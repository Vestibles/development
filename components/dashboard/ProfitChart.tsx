"use client";

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { formatCurrency } from "@/lib/calculations";
import { Card } from "../ui/Card";

interface ProfitChartProps {
  revenue: number;
  expenses: number;
  profit: number;
}

const COLORS = ["#7c9a82", "#e8a598", "#7eb8d4"];

export function ProfitChart({ revenue, expenses, profit }: ProfitChartProps) {
  const data = [
    { name: "Projected profit", value: Math.max(0, profit) },
    { name: "Expenses", value: expenses },
    { name: "Costs in stalls", value: Math.max(0, revenue - profit - expenses) },
  ].filter((d) => d.value > 0);

  if (data.length === 0) {
    return (
      <Card>
        <p className="text-sm text-[var(--color-muted)]">Add stalls and expenses to see the chart.</p>
      </Card>
    );
  }

  return (
    <Card>
      <h2 className="mb-3 text-sm font-semibold">Profit vs costs</h2>
      <div className="h-52 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={48}
              outerRadius={72}
              paddingAngle={2}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(v: number) => formatCurrency(v)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
