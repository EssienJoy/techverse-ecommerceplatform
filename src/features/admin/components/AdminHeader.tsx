import { Bell, CalendarDays, UserRound } from "lucide-react";
import { getCurrentUser } from "@/features/auth/server/current-user";

type AdminHeaderProps = {
	title: string;
};

const getInitials = (name: string) =>
	name
		.split(" ")
		.map((part) => part.charAt(0))
		.slice(0, 2)
		.join("")
		.toUpperCase();

const weekRange = "Oct 5 - Oct 11, 2026";

export async function AdminHeader({ title }: AdminHeaderProps) {
	const user = await getCurrentUser();
	const roleLabel =
		user?.role === "super_admin" ? "Super admin" : "Administrator";

	return (
		<header className='sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between gap-3 border-b border-border bg-card px-4 md:px-6'>
			<h1 className='min-w-0 truncate text-base font-semibold'>{title}</h1>

			<div className='flex items-center gap-2 md:gap-3'>
				<div className='hidden items-center gap-2 rounded-xl border border-border px-3 py-1.5 md:flex'>
					<CalendarDays className='size-3.5 text-muted-foreground' />
					<span className='text-xs font-medium'>{weekRange}</span>
				</div>

				<button
					type='button'
					aria-label='Notifications'
					className='relative flex size-9 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground'>
					<Bell className='size-4' />
					<span className='absolute right-2 top-2 size-2 rounded-full bg-danger ring-2 ring-card' />
				</button>

				<div className='hidden h-6 w-px bg-border sm:block' />

				{user ? (
					<div className='flex items-center gap-2.5'>
						<span className='flex size-9 items-center justify-center rounded-xl bg-primary text-xs font-bold text-foreground-inverse'>
							{getInitials(user.name)}
						</span>
						<span className='hidden flex-col leading-tight sm:flex'>
							<span className='text-sm font-semibold'>{user.name}</span>
							<span className='text-xs text-muted-foreground'>
								{roleLabel}
							</span>
						</span>
					</div>
				) : (
					<div className='flex items-center gap-2.5'>
						<span className='flex size-9 items-center justify-center rounded-xl bg-muted text-muted-foreground'>
							<UserRound className='size-4' />
						</span>
						<span className='hidden text-sm text-muted-foreground sm:block'>
							No profile
						</span>
					</div>
				)}
			</div>
		</header>
	);
}
