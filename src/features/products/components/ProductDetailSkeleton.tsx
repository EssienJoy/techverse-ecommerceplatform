import { Container, Skeleton } from "@/shared";

/**
 * Mirrors the product detail layout while the product query resolves so the
 * image, card, and action bar settle in place instead of jumping.
 */
export function ProductDetailSkeleton() {
	return (
		<div
			role='status'
			aria-busy='true'
			className='min-h-screen pb-24 lg:pb-16'>
			<span className='sr-only'>Loading product…</span>

			<header className='pointer-events-none fixed inset-x-0 top-4 z-50'>
				<div className='mx-auto flex max-w-7xl items-center justify-between px-4'>
					<Skeleton className='size-11 rounded-full border border-border/70 bg-white/90 shadow-[0_12px_28px_-18px_rgba(15,23,42,0.45)]' />
					<Skeleton className='size-11 rounded-full border border-border/70 bg-white/90 shadow-[0_12px_28px_-18px_rgba(15,23,42,0.45)]' />
				</div>
			</header>

			<section className='relative w-full overflow-hidden bg-white'>
				<div className='relative mx-auto flex h-[58vh] min-h-[430px] w-full items-center justify-center bg-white sm:h-[68vh] lg:h-[78vh]'>
					<Skeleton className='size-40 rounded-3xl sm:size-52' />
				</div>
			</section>

			<Container className='relative z-10 mt-6'>
				<div className='flex gap-2 overflow-hidden'>
					{Array.from({ length: 4 }).map((_, index) => (
						<Skeleton
							key={index}
							className='size-16 shrink-0 rounded-xl border border-border'
						/>
					))}
				</div>
			</Container>

			<Container className='relative z-10 mt-6 pb-12'>
				<div className='mx-auto max-w-6xl rounded-[1.75rem] border border-border/70 bg-background p-6 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.24)] sm:p-8 lg:p-9'>
					<div className='flex flex-col gap-5'>
						<div className='flex flex-wrap items-start justify-between gap-3'>
							<div className='w-full max-w-xl'>
								<Skeleton className='h-2.5 w-28' />
								<Skeleton className='mt-3 h-8 w-3/4 sm:h-9' />
								<Skeleton className='mt-2 h-8 w-1/2 sm:h-9' />
							</div>
							<Skeleton className='h-8 w-20 rounded-full' />
						</div>

						<div className='flex items-center gap-2'>
							<Skeleton className='size-1.5 rounded-full' />
							<Skeleton className='h-3.5 w-24' />
						</div>

						<div className='rounded-2xl border border-border/70 bg-surface-muted/40 p-4'>
							<div className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
								<div>
									<Skeleton className='h-2.5 w-12' />
									<Skeleton className='mt-2 h-8 w-36' />
								</div>
								<div className='flex items-center gap-2 sm:justify-end'>
									<Skeleton className='h-11 w-32 rounded-full' />
									<Skeleton className='h-11 w-36 rounded-full' />
								</div>
							</div>
						</div>

						<div className='mt-2'>
							<div className='flex items-center justify-between gap-2'>
								<Skeleton className='h-4 w-28' />
								<Skeleton className='h-3 w-24' />
							</div>
							<div className='mt-3 flex flex-wrap gap-2'>
								{Array.from({ length: 3 }).map((_, index) => (
									<Skeleton
										key={index}
										className='h-10 w-32 rounded-full'
									/>
								))}
							</div>
						</div>

						<div className='mt-4 flex flex-col gap-2 border-t border-border/70 pt-4'>
							{Array.from({ length: 3 }).map((_, index) => (
								<div key={index} className='flex items-center gap-2'>
									<Skeleton className='size-4 rounded-sm' />
									<Skeleton
										className={
											index === 0 ? "h-3 w-36" : index === 1 ? "h-3 w-28" : "h-3 w-40"
										}
									/>
								</div>
							))}
						</div>
					</div>
				</div>
			</Container>

			<section className='mx-auto mt-10 max-w-6xl border-t border-border pt-8'>
				<div className='flex items-center justify-between gap-3'>
					<Skeleton className='h-6 w-24' />
					<Skeleton className='h-7 w-32 shrink-0 rounded-full' />
				</div>
				<Skeleton className='mt-2 h-4 w-56' />

				<div className='mt-5 max-w-3xl divide-y divide-border'>
					{Array.from({ length: 2 }).map((_, index) => (
						<div key={index} className='space-y-2 py-4 first:pt-0'>
							<div className='flex items-center justify-between gap-2'>
								<Skeleton className='h-4 w-28' />
								<Skeleton className='h-3 w-20' />
							</div>
							<Skeleton className='h-3.5 w-full' />
							<Skeleton className='h-3.5 w-4/5' />
						</div>
					))}
				</div>
			</section>

			<div className='fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 backdrop-blur lg:hidden'>
				<Container className='flex items-center justify-between gap-4 py-3'>
					<div className='flex flex-col gap-1'>
						<Skeleton className='h-2.5 w-10' />
						<Skeleton className='h-6 w-24' />
					</div>
					<Skeleton className='h-10 w-36 rounded-full' />
				</Container>
			</div>
		</div>
	);
}
