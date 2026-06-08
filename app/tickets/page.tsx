"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Field } from "@/components/ui/Field";
import { ExportPanel } from "@/components/export/ExportPanel";
import { useEvent } from "@/lib/context/EventContext";
import { formatCurrency, ticketRevenue } from "@/lib/calculations";

function TicketRow({
  label,
  count,
  price,
  onCount,
  onPrice,
}: {
  label: string;
  count: number;
  price: number;
  onCount: (v: number) => void;
  onPrice: (v: number) => void;
}) {
  const subtotal = count * price;
  return (
    <Card padding="sm">
      <p className="mb-2 font-medium">{label}</p>
      <div className="grid grid-cols-2 gap-2">
        <Field
          label="Sold"
          type="number"
          min={0}
          value={count}
          onChange={(e) => onCount(parseInt(e.target.value, 10) || 0)}
        />
        <Field
          label="Price (£)"
          type="number"
          step="0.01"
          min={0}
          value={price}
          onChange={(e) => onPrice(parseFloat(e.target.value) || 0)}
        />
      </div>
      <p className="mt-2 text-right text-sm font-semibold text-[var(--color-sage-dark)]">
        {formatCurrency(subtotal)}
      </p>
    </Card>
  );
}

export default function TicketsPage() {
  const { data, updateTicketSales } = useEvent();
  const t = data.ticketSales;
  const ticketsTotal = ticketRevenue(t);
  const grandTotal = ticketsTotal + t.donations;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Tickets & donations"
        subtitle="Track entrance, raffle, and giving"
      />

      <ExportPanel data={data} scope="tickets" variant="compact" />

      <Card className="border-[var(--color-sage)]/30 bg-gradient-to-br from-[var(--color-sage)]/15 to-[var(--color-sky)]/10 text-center">
        <p className="text-sm text-[var(--color-muted)]">Grand total</p>
        <p className="text-3xl font-bold text-[var(--color-sage-dark)]">
          {formatCurrency(grandTotal)}
        </p>
        <p className="mt-1 text-xs text-[var(--color-muted)]">
          Tickets {formatCurrency(ticketsTotal)} · Donations{" "}
          {formatCurrency(t.donations)}
        </p>
      </Card>

      <TicketRow
        label="Adult tickets"
        count={t.adult_count}
        price={t.adult_price}
        onCount={(v) => updateTicketSales({ adult_count: v })}
        onPrice={(v) => updateTicketSales({ adult_price: v })}
      />
      <TicketRow
        label="Family tickets"
        count={t.family_count}
        price={t.family_price}
        onCount={(v) => updateTicketSales({ family_count: v })}
        onPrice={(v) => updateTicketSales({ family_price: v })}
      />
      <TicketRow
        label="Child tickets"
        count={t.child_count}
        price={t.child_price}
        onCount={(v) => updateTicketSales({ child_count: v })}
        onPrice={(v) => updateTicketSales({ child_price: v })}
      />
      <TicketRow
        label="Raffle tickets"
        count={t.raffle_count}
        price={t.raffle_price}
        onCount={(v) => updateTicketSales({ raffle_count: v })}
        onPrice={(v) => updateTicketSales({ raffle_price: v })}
      />

      <Card>
        <Field
          label="Donations total (£)"
          type="number"
          step="0.01"
          min={0}
          value={t.donations}
          onChange={(e) =>
            updateTicketSales({ donations: parseFloat(e.target.value) || 0 })
          }
          hint="Include cash collections, contactless, and gift aid pledges"
        />
      </Card>
    </div>
  );
}
