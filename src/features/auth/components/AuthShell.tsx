import type { ReactNode } from "react";
import {
	BadgeCheck,
	ChartLine,
	Headphones,
	PackageCheck,
	ShieldCheck,
	Truck,
	Users,
	type LucideIcon,
} from "lucide-react";
import { cn } from "cn";
import { Link, siteConfig } from "@/shared";

type AuthVariant = "customer" | "admin";

type AuthShellProps = {
	variant: AuthVariant;
	title: string;
	description: string;
	children: ReactNode;
	footer?: ReactNode;
};

const panels: Record<
	AuthVariant,
	{ eyebrow: string; heading: string; perks: { icon: LucideIcon; text: string }[] }
> = {
	customer: {
		eyebrow: "Gadgets & tech essentials",
		heading: "The latest tech, delivered to your door.",
		perks: [
			{ icon: Truck, text: "Fast delivery on every order" },
			{ icon: BadgeCheck, text: "Genuine products from trusted brands" },
			{ icon: Headphones, text: "Friendly support when you need it" },
		],
	},
	admin: {
		eyebrow: "Admin console",
		heading: `Run ${siteConfig.name} from one place.`,
		perks: [
			{ icon: PackageCheck, text: "Manage products, stock and content" },
			{ icon: ChartLine, text: "Track orders and store performance" },
			{ icon: Users, text: "Keep customers and admins in order" },
		],
	},
};

// Cached so the year is computed once instead of on every prerender.
async function CopyrightYear() {
	"use cache";
	return new Date().getFullYear();
}

function BrandMark({ variant, inverse }: { variant: AuthVariant; inverse?: boolean }) {
	return (
		<Link
			href={variant === "admin" ? "/admin" : "/"}
			className='inline-flex items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'>
			<span
				className={cn(
					"flex size-10 items-center justify-center rounded-xl text-sm font-bold",
					inverse
						? "bg-white text-primary"
						: "bg-primary text-foreground-inverse",
				)}>
				{siteConfig.name.charAt(0)}
			</span>
			<span className='flex flex-col leading-tight'>
				<span
					className={cn(
						"text-sm font-bold tracking-tight",
						inverse ? "text-white" : "text-foreground",
					)}>
					{siteConfig.name}
				</span>
				<span
					className={cn(
						"text-xs",
						inverse ? "text-white/70" : "text-muted-foreground",
					)}>
					{variant === "admin" ? "Admin console" : "Online store"}
				</span>
			</span>
		</Link>
	);
}

export function AuthShell({
	variant,
	title,
	description,
	children,
	footer,
}: AuthShellProps) {
	const panel = panels[variant];
	// The customer store is mobile-only, so its auth pages have no desktop
	// panel to fill: the form is the whole screen.
	const showPanel = variant === "admin";

	return (
		<div className={cn("min-h-dvh", showPanel && "grid lg:grid-cols-2")}>
			{showPanel ? (
				<aside className='relative hidden overflow-hidden bg-brand-900 lg:flex lg:flex-col lg:justify-between lg:p-10'>
					<div className='absolute -right-24 -top-24 size-96 rounded-full bg-brand-500/30 blur-3xl' />

					<div className='relative'>
						<BrandMark variant={variant} inverse />
					</div>

					<div className='relative max-w-md'>
						<p className='text-xs font-semibold uppercase tracking-widest text-white/70'>
							{panel.eyebrow}
						</p>
						<h2 className='mt-3 text-3xl font-bold leading-tight text-white'>
							{panel.heading}
						</h2>
						<ul className='mt-8 flex flex-col gap-4'>
							{panel.perks.map(({ icon: Icon, text }) => (
								<li
									key={text}
									className='flex items-center gap-3 text-sm text-white/90'>
									<span className='flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/15'>
										<Icon className='size-4' aria-hidden />
									</span>
									{text}
								</li>
							))}
						</ul>
					</div>

					<p className='relative text-xs text-white/60'>
						© <CopyrightYear /> {siteConfig.name}
					</p>
				</aside>
			) : null}

			<div className='flex flex-col bg-surface-muted px-gutter py-8 lg:bg-background'>
				<div className={showPanel ? "lg:hidden" : undefined}>
					<BrandMark variant={variant} />
				</div>

				<div className='mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-8'>
					<div className='rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8 lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none'>
						{variant === "admin" ? (
							<span className='mb-4 inline-flex items-center gap-2 rounded-full bg-primary-subtle px-3 py-1 text-xs font-medium text-foreground-primary'>
								<ShieldCheck className='size-3.5' aria-hidden />
								Restricted access
							</span>
						) : null}
						<h1 className='text-2xl font-bold tracking-tight text-foreground'>
							{title}
						</h1>
						<p className='mt-2 text-sm text-muted-foreground'>{description}</p>

						<div className='mt-6'>{children}</div>

						{footer ? (
							<div className='mt-6 border-t border-border pt-6 text-center text-sm text-muted-foreground'>
								{footer}
							</div>
						) : null}
					</div>
				</div>
			</div>
		</div>
	);
}
