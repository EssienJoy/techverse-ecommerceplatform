"use client";

import { useActionState } from "react";
import { Button } from "@/shared";
import {
	userSignupAction,
	type AuthFormState,
} from "@/features/auth/server/auth.actions";
import { AuthField, FormMessage, PasswordField } from "./AuthFields";

const initialState: AuthFormState = {};

export function NormalSignupForm({ next }: { next?: string | null }) {
	const [state, formAction, pending] = useActionState(
		userSignupAction,
		initialState,
	);

	return (
		<form action={formAction} className='flex flex-col gap-4'>
			{next ? <input type='hidden' name='next' value={next} /> : null}
			{state.error ? <FormMessage type='error'>{state.error}</FormMessage> : null}

			<AuthField
				id='signup-name'
				name='name'
				label='Full name'
				placeholder='Alex Morgan'
				autoComplete='name'
				errors={state.fieldErrors?.name}
				required
			/>

			<AuthField
				id='signup-email'
				name='email'
				label='Email'
				type='email'
				placeholder='you@example.com'
				autoComplete='email'
				errors={state.fieldErrors?.email}
				required
			/>

			<div className='grid gap-4 sm:grid-cols-2'>
				<PasswordField
					id='signup-password'
					name='password'
					label='Password'
					placeholder='8+ characters'
					autoComplete='new-password'
					minLength={8}
					errors={state.fieldErrors?.password}
					required
				/>

				<PasswordField
					id='signup-confirm'
					name='confirmPassword'
					label='Confirm password'
					placeholder='Repeat password'
					autoComplete='new-password'
					minLength={8}
					errors={state.fieldErrors?.confirmPassword}
					required
				/>
			</div>

			<Button type='submit' disabled={pending} className='mt-2 h-11 w-full'>
				{pending ? "Creating account..." : "Create account"}
			</Button>
		</form>
	);
}
