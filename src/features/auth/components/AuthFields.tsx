"use client";

import { useState, type ComponentProps } from "react";
import { CircleAlert, CircleCheck, Eye, EyeOff } from "lucide-react";
import { cn } from "cn";
import { Input } from "@/shared";
import { Label } from "@/shared/components/ui/label";

type AuthFieldProps = Omit<ComponentProps<typeof Input>, "id" | "name"> & {
	id: string;
	name: string;
	label: string;
	errors?: string[];
};

function useFieldA11y(id: string, errors?: string[]) {
	const errorId = `${id}-error`;
	const hasError = Boolean(errors?.length);
	return {
		errorId,
		hasError,
		inputProps: {
			"aria-invalid": hasError || undefined,
			"aria-describedby": hasError ? errorId : undefined,
		},
	};
}

function FieldError({ id, errors }: { id: string; errors?: string[] }) {
	if (!errors?.length) return null;

	return (
		<p id={id} className='text-xs text-danger'>
			{errors[0]}
		</p>
	);
}

export function AuthField({ id, label, errors, className, ...props }: AuthFieldProps) {
	const { errorId, inputProps } = useFieldA11y(id, errors);

	return (
		<div className='flex flex-col gap-2'>
			<Label htmlFor={id}>{label}</Label>
			<Input id={id} className={cn("h-11", className)} {...inputProps} {...props} />
			<FieldError id={errorId} errors={errors} />
		</div>
	);
}

export function PasswordField({
	id,
	label,
	errors,
	className,
	...props
}: Omit<AuthFieldProps, "type">) {
	const [visible, setVisible] = useState(false);
	const { errorId, inputProps } = useFieldA11y(id, errors);

	return (
		<div className='flex flex-col gap-2'>
			<Label htmlFor={id}>{label}</Label>
			<div className='relative'>
				<Input
					id={id}
					type={visible ? "text" : "password"}
					className={cn("h-11 pr-12", className)}
					{...inputProps}
					{...props}
				/>
				<button
					type='button'
					onClick={() => setVisible((value) => !value)}
					aria-label={visible ? "Hide password" : "Show password"}
					aria-pressed={visible}
					aria-controls={id}
					className='absolute inset-y-0 right-0 flex w-12 items-center justify-center rounded-r-md text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'>
					{visible ? (
						<EyeOff className='size-4' aria-hidden />
					) : (
						<Eye className='size-4' aria-hidden />
					)}
				</button>
			</div>
			<FieldError id={errorId} errors={errors} />
		</div>
	);
}

export function FormMessage({
	type,
	children,
}: {
	type: "error" | "success";
	children: string;
}) {
	const Icon = type === "error" ? CircleAlert : CircleCheck;

	return (
		<p
			role={type === "error" ? "alert" : "status"}
			className={cn(
				"flex items-start gap-2 rounded-xl border px-3 py-3 text-sm",
				type === "error"
					? "border-danger-border bg-danger-muted text-danger-foreground"
					: "border-success-border bg-success-muted text-success-foreground",
			)}>
			<Icon className='mt-1 size-4 shrink-0' aria-hidden />
			{children}
		</p>
	);
}
