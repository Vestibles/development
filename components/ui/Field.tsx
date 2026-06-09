"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  suffix?: ReactNode;
}

const DECIMAL_PATTERN = /^-?\d*\.?\d*$/;
const INTEGER_PATTERN = /^-?\d*$/;

function isDecimalStep(step?: string | number): boolean {
  if (step === undefined) return true;
  return String(step).includes(".");
}

function NumberInput({
  value,
  onChange,
  onBlur,
  step,
  min,
  className,
  ...rest
}: InputHTMLAttributes<HTMLInputElement>) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [text, setText] = useState(() =>
    value === undefined || value === null ? "" : String(value)
  );
  const [focused, setFocused] = useState(false);
  const decimal = isDecimalStep(step);

  useEffect(() => {
    if (!focused) {
      setText(value === undefined || value === null ? "" : String(value));
    }
  }, [value, focused]);

  function commit(raw: string) {
    if (raw === "" || raw === "-" || raw === ".") {
      return 0;
    }
    const parsed = decimal ? parseFloat(raw) : parseInt(raw, 10);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  function fireChange(num: number) {
    onChange?.({
      target: { value: String(num) },
    } as ChangeEvent<HTMLInputElement>);
  }

  return (
    <input
      ref={inputRef}
      type="text"
      inputMode={decimal ? "decimal" : "numeric"}
      className={className}
      value={text}
      onFocus={() => setFocused(true)}
      onChange={(e) => {
        const raw = e.target.value;
        const pattern = decimal ? DECIMAL_PATTERN : INTEGER_PATTERN;
        if (!pattern.test(raw)) return;

        setText(raw);

        if (raw === "" || raw === "-" || raw === ".") return;

        const parsed = decimal ? parseFloat(raw) : parseInt(raw, 10);
        if (Number.isFinite(parsed)) {
          fireChange(parsed);
        }
      }}
      onBlur={(e) => {
        setFocused(false);
        const final = commit(text);
        const minNum = min !== undefined ? Number(min) : undefined;
        const clamped =
          minNum !== undefined && !Number.isNaN(minNum)
            ? Math.max(minNum, final)
            : final;
        setText(clamped === 0 && text === "" ? "" : String(clamped));
        fireChange(clamped);
        onBlur?.(e);
      }}
      {...rest}
    />
  );
}

export function Field({
  label,
  hint,
  suffix,
  className = "",
  type,
  value,
  onChange,
  onBlur,
  step,
  min,
  ...props
}: FieldProps) {
  const inputClass = `w-full min-h-12 rounded-xl border border-[var(--color-border)] bg-white px-4 py-2.5 text-[var(--color-ink)] outline-none focus:border-[var(--color-sage-dark)] focus:ring-2 focus:ring-[var(--color-sage)]/30 ${className}`;

  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-[var(--color-ink)]">{label}</span>
      <div className="relative">
        {type === "number" ? (
          <NumberInput
            className={inputClass}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            step={step}
            min={min}
            {...props}
          />
        ) : (
          <input className={inputClass} type={type} value={value} onChange={onChange} onBlur={onBlur} {...props} />
        )}
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
        className="min-h-12 w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-2.5 outline-none focus:border-[var(--color-sage-dark)] focus:ring-2 focus:ring-[var(--color-sage)]/30"
        {...props}
      >
        {children}
      </select>
    </label>
  );
}
