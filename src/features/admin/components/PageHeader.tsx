import type { ReactNode } from "react";
import { cn } from "cn";

type PageHeaderProps = {
	title?: string;
	description?: string;
	children?: ReactNode;
};

export function PageHeader({ title, description, children }: PageHeaderProps) {
	return (
		<div className='flex flex-wrap items-center justify-between gap-3'>
			<div>
				{title ? <h1 className='text-xl font-bold'>{title}</h1> : null}
				{description ? (
					<p
						className={cn(
							"text-sm text-muted-foreground",
							title && "mt-1",
						)}>
						{description}
					</p>
				) : null}
			</div>
			{children}
		</div>
	);
}
