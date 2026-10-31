"use client";

import { useActionState } from "react";
import {
	updatePasswordAction,
	type ProfileFormState,
} from "../server/user.action";

const initialState: ProfileFormState = {};

export function UpdatePasswordForm() {
	const [state, formAction, pending] = useActionState(
		updatePasswordAction,
		initialState,
	);

	return (
		<section className='rounded-3xl border border-border/80 bg-card p-4 shadow-sm'>
			<h2 className='mb-3 text-sm font-semibold text-card-foreground'>
				Password
			</h2>

			<form action={formAction} className='space-y-4'>
				<PasswordField
					label='Current password'
					name='currentPassword'
					errors={state.fieldErrors?.currentPassword}
					autoComplete='current-password'
				/>
				<PasswordField
					label='New password'
					name='password'
					errors={state.fieldErrors?.password}
					autoComplete='new-password'
				/>
				<PasswordField
					label='Confirm new password'
					name='confirmPassword'
					errors={state.fieldErrors?.confirmPassword}
					autoComplete='new-password'
				/>

				{state.error && (
					<p className='rounded-md border border-error-border bg-error-muted px-3 py-2 text-sm text-error-foreground'>
						{state.error}
					</p>
				)}
				{state.success && (
					<p className='rounded-md border border-success-border bg-success-muted px-3 py-2 text-sm text-success-foreground'>
						{state.success}
					</p>
				)}

				<button
					type='submit'
					disabled={pending}
					className='inline-flex h-11 w-full items-center justify-center rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover active:bg-primary-active disabled:opacity-60'>
					{pending ? "Updating…" : "Update password"}
				</button>
			</form>
		</section>
	);
}

function PasswordField({
	label,
	name,
	errors,
	autoComplete,
}: {
	label: string;
	name: string;
	errors?: string[];
	autoComplete?: string;
}) {
	const id = `pw-${name}`;
	return (
		<div className='space-y-2'>
			<label htmlFor={id} className='text-sm font-medium text-foreground'>
				{label}
			</label>
			<input
				id={id}
				name={name}
				type='password'
				autoComplete={autoComplete}
				aria-invalid={errors ? true : undefined}
				aria-describedby={errors ? `${id}-error` : undefined}
				className='h-10 w-full rounded-xl border border-input-border bg-surface px-3 text-sm text-foreground placeholder:text-input-placeholder focus:border-input-focus focus:outline-none focus:ring-2 focus:ring-ring/50 aria-[invalid=true]:border-error'
			/>
			{errors?.map((e) => (
				<p key={e} id={`${id}-error`} className='text-sm text-error'>
					{e}
				</p>
			))}
		</div>
	);
}
