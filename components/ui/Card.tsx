import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: "sm" | "md" | "lg";
}

const paddingMap = {
  sm: "p-3",
  md: "p-4",
  lg: "p-5",
};

export function Card({
  children,
  className = "",
  padding = "md",
}: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-[var(--color-border)]/80 bg-[var(--color-card)] shadow-sm shadow-[var(--color-sage-dark)]/5 ${paddingMap[padding]} ${className}`}
    >
      {children}
    </div>
  );
}
