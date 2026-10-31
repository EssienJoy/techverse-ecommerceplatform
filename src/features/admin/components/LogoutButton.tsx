"use client";

import { LogOut } from "lucide-react";
import { cn } from "cn";
import { logoutAction } from "@/features/auth/server/auth.actions";

type LogoutButtonProps = {
	className?: string;
	collapsed?: boolean;
};

export function LogoutButton({ className, collapsed }: LogoutButtonProps) {
	return (
		<form action={logoutAction}>
			<button
				type='submit'
				title={collapsed ? "Log out" : undefined}
				className={cn(
					"flex w-full items-center rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-danger-muted hover:text-danger",
					collapsed ? "justify-center lg:justify-start lg:gap-3" : "gap-3",
					className,
				)}>
				<LogOut className='size-4 shrink-0' />
				<span className={cn(collapsed && "hidden lg:inline")}>Log out</span>
			</button>
		</form>
	);
}
