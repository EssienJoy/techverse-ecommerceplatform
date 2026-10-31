"use client";

import { LogOut } from "lucide-react";
import { logoutAction } from "@/features/auth/server/auth.actions";

export function LogoutButton() {
	return (
		<form action={logoutAction}>
			<button
				type='submit'
				className='flex w-full items-center gap-3 rounded-3xl border border-danger-border bg-danger-muted px-4 py-4 text-left text-sm font-medium text-danger-foreground transition-colors hover:bg-danger/10'>
				<span className='flex size-9 shrink-0 items-center justify-center rounded-xl bg-danger/10 text-danger'>
					<LogOut className='size-4' aria-hidden />
				</span>
				<span className='flex flex-col'>
					<span>Log out</span>
					<span className='text-xs font-normal text-danger-foreground/80'>
						Sign out of this device
					</span>
				</span>
			</button>
		</form>
	);
}
