import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: Variant;
  fullWidth?: boolean;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-gradient-to-r from-[var(--color-sage-dark)] to-[var(--color-sky-dark)] text-white shadow-md shadow-[var(--color-sage-dark)]/25 hover:brightness-110 active:scale-[0.98]",
  secondary:
    "bg-white border border-[var(--color-border)] text-[var(--color-ink)] hover:bg-[var(--color-cream)]",
  ghost: "bg-transparent text-[var(--color-sage-dark)] hover:bg-[var(--color-cream)]",
  danger: "bg-[var(--color-coral)] text-white hover:opacity-90",
};

export function Button({
  children,
  variant = "primary",
  fullWidth,
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-5 py-3 text-base font-medium transition ${variants[variant]} ${fullWidth ? "w-full" : ""} disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
