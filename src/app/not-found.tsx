"use client";

import { useRouter } from "next/navigation";
import { Compass } from "lucide-react";
import { Button } from "@/shared";

export default function NotFound() {
	const router = useRouter();

	return (
		<div className='flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center'>
			<span className='flex size-16 items-center justify-center rounded-2xl bg-brand-50 text-primary'>
				<Compass className='size-8' />
			</span>
			<h1 className='text-2xl font-bold'>Page not found</h1>
			<p className='max-w-sm text-sm text-muted-foreground'>
				The page you are looking for doesn&apos;t exist or has been moved.
			</p>
			<div className='mt-2 flex gap-2'>
				<Button onClick={() => router.back()}>Go back</Button>
				<Button variant='outline' onClick={() => window.location.reload()}>
					Reload
				</Button>
			</div>
		</div>
	);
}
