import type { ComponentProps } from "react";
import NextLink from "next/link";
import { cn } from "cn";

export type LinkProps = ComponentProps<typeof NextLink>;

export function Link({ className, ...props }: LinkProps) {
  return (
    <NextLink className={cn("text-primary transition-colors", className)} {...props} />
  );
}
