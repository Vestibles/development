"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Store,
  Calculator,
  ShoppingBag,
  Ticket,
  Users,
  Sparkles,
} from "lucide-react";

const links = [
  { href: "/", label: "Home", icon: LayoutDashboard },
  { href: "/stalls", label: "Stalls", icon: Store },
  { href: "/simulator", label: "Simulate", icon: Calculator },
  { href: "/shopping", label: "Shop", icon: ShoppingBag },
  { href: "/tickets", label: "Tickets", icon: Ticket },
  { href: "/volunteers", label: "Team", icon: Users },
  { href: "/insights", label: "Insights", icon: Sparkles },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--color-border)] bg-white/95 backdrop-blur-md safe-area-pb"
      aria-label="Main navigation"
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-between gap-0 px-1 py-1">
        {links.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className={`flex min-h-[3.25rem] flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-1 text-[10px] font-medium transition ${
                  active
                    ? "bg-[var(--color-sage)]/15 text-[var(--color-sage-dark)]"
                    : "text-[var(--color-muted)] hover:text-[var(--color-ink)]"
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" aria-hidden />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
