"use client";

import { useActionState } from "react";
import {
	updateProfileAction,
	type ProfileFormState,
} from "../server/user.action";

const initialState: ProfileFormState = {};

export function ProfileForm({
	defaultValues,
}: {
	defaultValues: { name: string; email: string };
}) {
	const [state, formAction, pending] = useActionState(
		updateProfileAction,
		initialState,
	);

	return (
		<section className='rounded-xl border border-border bg-card p-5 shadow-sm'>
			<h2 className='mb-4 font-heading text-lg font-semibold text-card-foreground'>
				Personal details
			</h2>

			<form action={formAction} className='space-y-4'>
				<Field
					label='Name'
					name='name'
					defaultValue={defaultValues.name}
					errors={state.fieldErrors?.name}
					autoComplete='name'
				/>
				<Field
					label='Email'
					name='email'
					type='email'
					defaultValue={defaultValues.email}
					errors={state.fieldErrors?.email}
					autoComplete='email'
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
					className='inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover active:bg-primary-active disabled:opacity-60'>
					{pending ? "Saving…" : "Save changes"}
				</button>
			</form>
		</section>
	);
}

function Field({
	label,
	name,
	type = "text",
	defaultValue,
	errors,
	autoComplete,
}: {
	label: string;
	name: string;
	type?: string;
	defaultValue?: string;
	errors?: string[];
	autoComplete?: string;
}) {
	const id = `profile-${name}`;
	return (
		<div className='space-y-1.5'>
			<label htmlFor={id} className='text-sm font-medium text-foreground'>
				{label}
			</label>
			<input
				id={id}
				name={name}
				type={type}
				defaultValue={defaultValue}
				autoComplete={autoComplete}
				aria-invalid={errors ? true : undefined}
				aria-describedby={errors ? `${id}-error` : undefined}
				className='w-full rounded-md border border-input-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-input-placeholder focus:border-input-focus focus:outline-none focus:ring-2 focus:ring-ring/50 aria-[invalid=true]:border-error'
			/>
			{errors?.map((e) => (
				<p key={e} id={`${id}-error`} className='text-sm text-error'>
					{e}
				</p>
			))}
		</div>
	);
}
