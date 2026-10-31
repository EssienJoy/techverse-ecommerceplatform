import { BadgeCheck, CalendarDays, Mail } from "lucide-react";

type ProfileIdentityProps = {
	name: string | null;
	email: string;
	role: string;
	/** ISO date or Date; shown as the month and year the account was created. */
	memberSince: Date | string;
};

const roleLabels: Record<string, string> = {
	user: "Customer",
	admin: "Admin",
	super_admin: "Super admin",
};

/**
 * The profile card at the top of the dashboard. It is plain markup so the
 * dashboard page can render it from the session without a client component.
 */
export function ProfileIdentity({
	name,
	email,
	role,
	memberSince,
}: ProfileIdentityProps) {
	const displayName = name?.trim() || "TechNest customer";
	const initial = (displayName[0] ?? email[0] ?? "T").toUpperCase();
	const joined = new Intl.DateTimeFormat("en", {
		month: "short",
		year: "numeric",
	}).format(new Date(memberSince));

	return (
		<section className='relative overflow-hidden rounded-3xl border border-border/80 bg-card p-6 shadow-sm'>
			<div
				aria-hidden
				className='absolute -right-10 -top-12 size-36 rounded-full bg-primary-subtle/70 blur-2xl'
			/>

			<div className='relative flex items-center gap-4'>
				<div
					aria-hidden
					className='flex size-16 shrink-0 items-center justify-center rounded-full bg-primary text-xl font-bold text-foreground-inverse shadow-sm'>
					{initial}
				</div>

				<div className='min-w-0 flex-1'>
					<div className='flex flex-wrap items-center gap-2'>
						<h2 className='truncate text-lg font-bold leading-tight text-foreground'>
							{displayName}
						</h2>
						<span className='inline-flex items-center gap-1 rounded-full bg-accent px-2 py-1 text-[10px] font-semibold text-accent-foreground'>
							<BadgeCheck className='size-3' aria-hidden />
							{roleLabels[role] ?? role}
						</span>
					</div>

					<p className='mt-1 flex items-center gap-2 truncate text-sm text-muted-foreground'>
						<Mail className='size-3.5 shrink-0' aria-hidden />
						<span className='truncate'>{email}</span>
					</p>

					<p className='mt-1 flex items-center gap-2 text-xs text-muted-foreground'>
						<CalendarDays className='size-3.5 shrink-0' aria-hidden />
						Member since {joined}
					</p>
				</div>
			</div>
		</section>
	);
}
