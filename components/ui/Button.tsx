import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: Variant;
  fullWidth?: boolean;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-[var(--color-sage-dark)] text-white hover:bg-[var(--color-sage)] active:scale-[0.98]",
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
