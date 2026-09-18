import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-app-border bg-app-surface p-5",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeading({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("font-display text-lg font-extrabold tracking-tight", className)}
      {...props}
    />
  );
}
