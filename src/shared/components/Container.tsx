import type { ElementType, ReactNode } from "react";
import { cn } from "cn";

type ContainerProps = {
	children: ReactNode;
	className?: string;
	as?: ElementType;
};

export function Container({
	as: Tag = "div",
	className,
	children,
}: ContainerProps) {
	return (
		<Tag className={cn("mx-auto  max-w-7xl px-4", className)}>{children}</Tag>
	);
}
