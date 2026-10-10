"use client";

import { TriangleAlert } from "lucide-react";
import { Button, Link } from "@/shared";

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	return (
		<div className='flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center'>
			<span className='flex size-16 items-center justify-center rounded-2xl bg-danger-muted text-danger-foreground'>
				<TriangleAlert className='size-8' />
			</span>
			<h1 className='text-2xl font-bold'>Something went wrong</h1>
			<p className='max-w-sm text-sm text-muted-foreground'>
				{error.message || "An unexpected error occurred. Please try again."}
			</p>
			<div className='mt-2 flex gap-2'>
				<Button onClick={reset}>Try again</Button>
				<Button variant='outline' render={<Link href='/' />}>
					Back home
				</Button>
			</div>
		</div>
	);
}
