import type { ComponentProps } from "react";
import { Button as ShadcnButton } from "@/shared/components/ui/button";

export type ButtonProps = ComponentProps<typeof ShadcnButton>;

export function Button({
  variant = "default",
  size = "default",
  ...props
}: ButtonProps) {
  return <ShadcnButton variant={variant} size={size} {...props} />;
}
