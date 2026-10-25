"use client";

import { useActionState } from "react";
import { Button } from "@/shared";
import {
	loginAction,
	type AuthFormState,
} from "@/features/auth/server/auth.actions";
import { AuthField, FormMessage, PasswordField } from "./AuthFields";

const initialState: AuthFormState = {};

export function NormalLoginForm() {
	const [state, formAction, pending] = useActionState(
		loginAction,
		initialState,
	);

	return (
		<form action={formAction} className='flex flex-col gap-4'>
			{state.error ? <FormMessage type='error'>{state.error}</FormMessage> : null}

			<AuthField
				id='login-email'
				name='email'
				label='Email'
				type='email'
				placeholder='you@example.com'
				autoComplete='email'
				errors={state.fieldErrors?.email}
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
