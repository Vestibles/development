interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <header className="mb-5">
      <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-ink)]">
        {title}
      </h1>
      {subtitle ? (
        <p className="mt-1 text-sm text-[var(--color-muted)]">{subtitle}</p>
      ) : null}
    </header>
  );
}
