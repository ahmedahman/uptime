import { type ReactNode } from "react";
import { Container } from "@/components/layout/container";
import { NavTabs } from "@/components/layout/nav-tabs";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header
        className="border-b border-app-border"
        style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
      >
        <Container className="flex h-14 items-center">
          <span className="font-display text-lg font-black tracking-tight">
            FIT<span className="text-accent-primary">TRACK</span>
          </span>
        </Container>
      </header>

      <main className="flex-1 py-6">
        <Container>{children}</Container>
      </main>

      <NavTabs />
    </div>
  );
}
