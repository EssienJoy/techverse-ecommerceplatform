"use client";

import { TriangleAlert } from "lucide-react";
import { Button, Container, Link } from "@/shared";

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	return (
		<main>
			<Container
				className='flex min-h-dvh gap-3 flex-col items-center 
		justify-center text-center'>
				<span
					className='flex size-16 items-center justify-center
			 rounded-2xl bg-danger-muted text-danger-foreground'>
					<TriangleAlert className='size-8' />
				</span>
				<h1 className='text-2xl font-bold'>Something went wrong</h1>
				<p className=' text-sm text-muted-foreground '>
					{error.message || "An unexpected error occurred. Please try again."}
				</p>
				<div className='mt-2 flex gap-2'>
					<Button onClick={reset}>Try again</Button>
					<Button
						variant='outline'
						nativeButton={false}
						render={<Link href='/' />}>
						Back home
					</Button>
				</div>
			</Container>
		</main>
	);
}
