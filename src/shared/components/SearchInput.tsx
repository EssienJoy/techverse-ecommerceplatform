import { ArrowRight, Search } from "lucide-react";
import { Input } from "./ui/input";

type SearchInputProps = {
	defaultValue?: string;
};

export function SearchInput({ defaultValue = "" }: SearchInputProps) {
	return (
		<form action='/search' role='search'>
			<div className='relative'>
				<Search className='absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
				<Input
					name='q'
					type='search'
					defaultValue={defaultValue}
					placeholder='Search products...'
					aria-label='Search products'
					className='h-11 rounded-full border-border bg-background pl-10 pr-12 shadow-sm'
				/>
				<button
					type='submit'
					aria-label='Submit search'
					className='absolute right-1.5 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-foreground-inverse transition-colors hover:bg-primary/80'>
					<ArrowRight className='size-4' />
				</button>
			</div>
		</form>
	);
}