"use client";

interface SegmentTabsProps<T extends string> {
  tabs: { id: T; label: string }[];
  active: T;
  onChange: (id: T) => void;
}

export function SegmentTabs<T extends string>({
  tabs,
  active,
  onChange,
}: SegmentTabsProps<T>) {
  return (
    <div
      className="flex gap-1 rounded-xl bg-[var(--color-cream-deep)]/60 p-1"
      role="tablist"
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={active === tab.id}
          onClick={() => onChange(tab.id)}
          className={`min-h-11 flex-1 rounded-lg px-3 py-2 text-sm font-medium transition ${
            active === tab.id
              ? "bg-white text-[var(--color-sage-dark)] shadow-sm ring-1 ring-[var(--color-sage)]/20"
              : "text-[var(--color-muted)]"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
