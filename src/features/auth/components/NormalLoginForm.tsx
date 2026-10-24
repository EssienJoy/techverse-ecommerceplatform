"use client";

import { useActionState } from "react";
import { Button, Input } from "@/shared";
import { Label } from "@/shared/components/ui/label";
import {
	loginAction,
	type AuthFormState,
} from "@/features/auth/server/auth.actions";

const initialState: AuthFormState = {};

function FieldError({ messages }: { messages?: string[] }) {
	if (!messages?.length) return null;

	return <p className='text-xs text-danger'>{messages[0]}</p>;
}

export function NormalLoginForm() {
	const [state, formAction, pending] = useActionState(
		loginAction,
		initialState,
	);

	return (
		<form action={formAction} className='flex flex-col gap-4'>
			<div className='flex flex-col gap-2'>
				<Label htmlFor='login-email'>Email</Label>
				<Input
					id='login-email'
					name='email'
					type='email'
					placeholder='you@example.com'
					autoComplete='email'
					required
				/>
				<FieldError messages={state.fieldErrors?.email} />
			</div>

			<div className='flex flex-col gap-2'>
				<Label htmlFor='login-password'>Password</Label>
				<Input
					id='login-password'
					name='password'
					type='password'
					placeholder='••••••••'
					autoComplete='current-password'
					required
				/>
			</div>

			{state.error ? (
				<p role='alert' className='text-sm text-danger'>
					{state.error}
				</p>
			) : null}

			<Button type='submit' disabled={pending} className='mt-2 w-full'>
				{pending ? "Signing in..." : "Sign in"}
			</Button>
		</form>
	);
}