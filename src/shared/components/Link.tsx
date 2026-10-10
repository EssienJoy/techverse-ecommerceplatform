"use client";

import type { ComponentProps } from "react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "cn";

export type LinkProps = ComponentProps<typeof NextLink>;

export function Link({ className, ...props }: LinkProps) {
  const pathname = usePathname();
  const href = typeof props.href === "string" ? props.href : "";
  const isActive =
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <NextLink
      className={cn(
        "text-primary transition-colors",
        className,
        isActive && "font-semibold text-foreground"
      )}
      aria-current={isActive ? "page" : undefined}
      {...props}
    />
  );
}
