"use client";

import { useActionState } from "react";
import { Button } from "@/shared";
import {
	loginAction,
	type AuthFormState,
} from "@/features/auth/server/auth.actions";
import { AuthField, FormMessage, PasswordField } from "./AuthFields";

const initialState: AuthFormState = { status: "idle" };

export function NormalLoginForm({ next }: { next?: string | null }) {
	const [state, formAction, pending] = useActionState(
		loginAction,
		initialState,
	);
	const fieldErrors = state.status === "error" ? state.fieldErrors : undefined;

	return (
		<form action={formAction} className='flex flex-col gap-4'>
			{next ? <input type='hidden' name='next' value={next} /> : null}
			{state.status === "error" && !state.fieldErrors ? (
				<FormMessage type='error'>{state.message}</FormMessage>
			) : null}

			<AuthField
				id='login-email'
				name='email'
				label='Email'
				type='email'
				placeholder='you@example.com'
				autoComplete='email'
				errors={fieldErrors?.email}
				required
			/>

			<PasswordField
				id='login-password'
				name='password'
				label='Password'
				placeholder='Enter your password'
				autoComplete='current-password'
				required
			/>

			<Button type='submit' disabled={pending} className='mt-2 h-11 w-full'>
				{pending ? "Signing in..." : "Sign in"}
			</Button>
		</form>
	);
}
