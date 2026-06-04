import type { InputHTMLAttributes, ReactNode } from "react";

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  suffix?: ReactNode;
}

export function Field({ label, hint, suffix, className = "", ...props }: FieldProps) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-[var(--color-ink)]">{label}</span>
      <div className="relative">
        <input
          className={`w-full min-h-12 rounded-xl border border-[var(--color-border)] bg-white px-4 py-2.5 text-[var(--color-ink)] outline-none focus:border-[var(--color-sage)] focus:ring-2 focus:ring-[var(--color-sage)]/20 ${className}`}
          {...props}
        />
        {suffix ? (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[var(--color-muted)]">
            {suffix}
          </span>
        ) : null}
      </div>
      {hint ? <span className="text-xs text-[var(--color-muted)]">{hint}</span> : null}
    </label>
  );
}

export function SelectField({
  label,
  children,
  ...props
}: {
  label: string;
  children: ReactNode;
} & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium">{label}</span>
      <select
        className="min-h-12 w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-2.5 outline-none focus:border-[var(--color-sage)] focus:ring-2 focus:ring-[var(--color-sage)]/20"
        {...props}
      >
        {children}
      </select>
    </label>
  );
}
