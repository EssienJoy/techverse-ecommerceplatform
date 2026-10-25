"use client";

import { useActionState } from "react";
import { Button } from "@/shared";
import {
	adminSignupAction,
	type AuthFormState,
} from "@/features/auth/server/auth.actions";
import { AuthField, FormMessage, PasswordField } from "./AuthFields";

const initialState: AuthFormState = {};

export function AdminSignupForm() {
	const [state, formAction, pending] = useActionState(
		adminSignupAction,
		initialState,
	);

	return (
		<form action={formAction} className='flex flex-col gap-4'>
			{state.error ? <FormMessage type='error'>{state.error}</FormMessage> : null}
			{state.success ? (
				<FormMessage type='success'>{state.success}</FormMessage>
			) : null}

			<AuthField
				id='admin-signup-name'
				name='name'
				label='Full name'
				placeholder='Alex Morgan'
				autoComplete='off'
				errors={state.fieldErrors?.name}
				required
			/>

			<AuthField
				id='admin-signup-email'
				name='email'
				label='Work email'
				type='email'
				placeholder='admin@example.com'
				autoComplete='off'
				errors={state.fieldErrors?.email}
				required
			/>

			<div className='grid gap-4 sm:grid-cols-2'>
				<PasswordField
					id='admin-signup-password'
					name='password'
					label='Temporary password'
					placeholder='8+ characters'
					autoComplete='new-password'
					minLength={8}
					errors={state.fieldErrors?.password}
					required
				/>

				<PasswordField
					id='admin-signup-confirm'
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
				{pending ? "Creating account..." : "Create admin account"}
			</Button>
		</form>
	);
}
