import { cn } from "cn";

type DotsLoaderProps = {
	className?: string;
};

export function DotsLoader({ className }: DotsLoaderProps) {
	return (
		<span
			role='status'
			aria-label='Loading'
			className={cn("inline-flex items-center gap-1.5", className)}>
			<span className='size-2 animate-bounce rounded-full bg-brand-600 [animation-delay:-0.3s]' />
			<span className='size-2 animate-bounce rounded-full bg-brand-600 [animation-delay:-0.15s]' />
			<span className='size-2 animate-bounce rounded-full bg-brand-600' />
		</span>
	);
}
