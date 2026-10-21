"use client";

import { useActionState } from "react";
import { Button, Input } from "@/shared";
import { Label } from "@/shared/components/ui/label";
import {
	createUserAction,
	type AuthFormState,
} from "@/features/auth/server/auth.actions";

const initialState: AuthFormState = {};

function FieldError({ messages }: { messages?: string[] }) {
	if (!messages?.length) return null;

	return <p className='text-xs text-danger'>{messages[0]}</p>;
}

export function AdminSignupForm() {
	const [state, formAction, pending] = useActionState(
		createUserAction,
		initialState,
	);

	return (
		<form action={formAction} className='flex flex-col gap-4'>
			<div className='flex flex-col gap-2'>
				<Label htmlFor='signup-name'>Full name</Label>
				<Input
					id='signup-name'
					name='name'
					placeholder='Alex Morgan'
					autoComplete='name'
					required
				/>
				<FieldError messages={state.fieldErrors?.name} />
			</div>

			<div className='flex flex-col gap-2'>
				<Label htmlFor='signup-email'>Email</Label>
				<Input
					id='signup-email'
					name='email'
					type='email'
					placeholder='you@example.com'
					autoComplete='email'
					required
				/>
				<FieldError messages={state.fieldErrors?.email} />
			</div>

			<div className='flex flex-col gap-2'>
				<Label htmlFor='signup-password'>Password</Label>
				<Input
					id='signup-password'
					name='password'
					type='password'
					placeholder='At least 8 characters'
					autoComplete='new-password'
					minLength={8}
					required
				/>
				<FieldError messages={state.fieldErrors?.password} />
			</div>

			<div className='flex flex-col gap-2'>
				<Label htmlFor='signup-confirm'>Confirm password</Label>
				<Input
					id='signup-confirm'
					name='confirmPassword'
					type='password'
					placeholder='••••••••'
					autoComplete='new-password'
					minLength={8}
					required
				/>
				<FieldError messages={state.fieldErrors?.confirmPassword} />
			</div>

			{state.error ? (
				<p role='alert' className='text-sm text-danger'>
					{state.error}
				</p>
			) : null}

			{state.success ? (
				<p role='status' className='text-sm text-success'>
					{state.success}
				</p>
			) : null}

			<Button type='submit' disabled={pending} className='mt-2 w-full'>
				{pending ? "Creating account..." : "Create account"}
			</Button>
		</form>
	);
}
