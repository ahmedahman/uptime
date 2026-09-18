"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/lib/constants/routes";
import { cn } from "@/lib/utils/cn";

const TABS = [
  { href: ROUTES.gym, label: "Gym" },
  { href: ROUTES.nutrition, label: "Nutrition" },
];

export function NavTabs() {
  const pathname = usePathname();

  return (
    <nav className="sticky bottom-0 z-20 border-t border-app-border bg-app-surface/95 backdrop-blur supports-[backdrop-filter]:bg-app-surface/80"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="mx-auto flex max-w-2xl">
        {TABS.map((tab) => {
          const active = pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex-1 py-3 text-center text-sm font-semibold transition-colors",
                active ? "text-accent-primary" : "text-app-muted",
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
