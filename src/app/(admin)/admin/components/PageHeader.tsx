import type { ReactNode } from "react";

type PageHeaderProps = {
	title: string;
	description?: string;
	children?: ReactNode;
};

export function PageHeader({ title, description, children }: PageHeaderProps) {
	return (
		<div className='flex flex-wrap items-center justify-between gap-3'>
			<div>
				<h1 className='text-xl font-bold'>{title}</h1>
				{description ? (
					<p className='mt-1 text-sm text-muted-foreground'>{description}</p>
				) : null}
			</div>
			{children}
		</div>
	);
}
