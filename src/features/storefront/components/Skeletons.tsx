import { Container, Skeleton } from "@/shared";

export function HeroSkeleton() {
	return (
		<section className='my-6'>
			<Container>
				<Skeleton className='aspect-[4/3] w-full rounded-3xl' />
			</Container>
		</section>
	);
}

export function CategoriesSkeleton() {
	return (
		<section className='my-6'>
			<Container>
				<ul className='flex gap-2 overflow-hidden'>
					{Array.from({ length: 8 }).map((_, index) => (
						<li
							key={index}
							className='flex w-16 shrink-0 flex-col items-center gap-1.5'>
							<Skeleton className='size-11 rounded-full' />
							<Skeleton className='h-3 w-10' />
						</li>
					))}
				</ul>
			</Container>
		</section>
	);
}

export function DealsSkeleton() {
	return (
		<section className='py-1'>
			<Container>
				<div className='rounded-3xl bg-surface-muted p-4'>
					<div className='mb-6 flex items-center justify-between gap-3'>
						<div className='flex items-center gap-2.5'>
							<Skeleton className='size-10 rounded-2xl' />
							<div className='flex flex-col gap-1.5'>
								<Skeleton className='h-4 w-24' />
								<Skeleton className='h-2.5 w-32' />
							</div>
						</div>
						<Skeleton className='h-8 w-20 rounded-xl' />
					</div>
					<div className='mt-4 grid grid-cols-2 gap-2'>
						{Array.from({ length: 4 }).map((_, index) => (
							<div key={index} className='rounded-2xl bg-card p-2'>
								<Skeleton className='h-24 w-full rounded-xl' />
								<Skeleton className='mt-2 h-3 w-full' />
								<Skeleton className='mt-1 h-3 w-2/3' />
								<Skeleton className='mt-2 h-4 w-20' />
							</div>
						))}
					</div>
					<Skeleton className='mt-6 h-8 w-full rounded-xl' />
				</div>
			</Container>
		</section>
	);
}

export function BrandsSkeleton() {
	return (
		<section className='my-6'>
			<Container>
				<div className='flex items-center gap-2'>
					<ul className='flex flex-1 items-center gap-4 overflow-hidden'>
						{Array.from({ length: 8 }).map((_, index) => (
							<li key={index} className='shrink-0'>
								<Skeleton className='h-6 w-20 sm:h-8' />
							</li>
						))}
					</ul>
					<div className='flex shrink-0 gap-0.5'>
						<Skeleton className='size-7 rounded-lg' />
						<Skeleton className='size-7 rounded-lg' />
					</div>
				</div>
			</Container>
		</section>
	);
}

export function LimitedStockSkeleton() {
	return (
		<section className='py-1'>
			<Container>
				<div className='flex items-center justify-between'>
					<Skeleton className='h-6 w-32' />
					<Skeleton className='h-4 w-12' />
				</div>
				<ul className='mt-3 flex gap-2 overflow-hidden pb-2'>
					{Array.from({ length: 5 }).map((_, index) => (
						<li key={index} className='w-36 shrink-0'>
							<div className='flex flex-col rounded-2xl border border-border bg-card p-2'>
								<Skeleton className='h-20 w-full rounded-xl' />
								<Skeleton className='mt-2 h-3 w-full' />
								<Skeleton className='mt-1 h-4 w-16' />
								<Skeleton className='mt-2 h-1.5 w-full rounded-full' />
								<Skeleton className='mt-1.5 h-2.5 w-16' />
							</div>
						</li>
					))}
				</ul>
			</Container>
		</section>
	);
}

export function RecentlyViewedSkeleton() {
	return (
		<section className='my-6'>
			<Container>
				<div className='flex items-center gap-2'>
					<Skeleton className='size-7 rounded-lg' />
					<Skeleton className='h-6 w-40' />
				</div>
				<ul className='mt-3 flex gap-2 overflow-hidden pb-2'>
					{Array.from({ length: 6 }).map((_, index) => (
						<li key={index} className='w-28 shrink-0'>
							<div className='flex flex-col'>
								<Skeleton className='h-24 w-full rounded-2xl' />
								<Skeleton className='mt-1.5 h-3 w-full' />
								<Skeleton className='mt-0.5 h-3 w-14' />
							</div>
						</li>
					))}
				</ul>
			</Container>
		</section>
	);
}

export function ProductSectionsSkeleton() {
	return (
		<>
			{Array.from({ length: 2 }).map((_, sectionIndex) => (
				<section key={sectionIndex} className='my-6'>
					<Container>
						<div className='flex items-center justify-between'>
							<Skeleton className='h-6 w-32' />
							<Skeleton className='h-4 w-14' />
						</div>
						<div className='mt-3 flex gap-2 overflow-hidden'>
							{Array.from({ length: 4 }).map((_, index) => (
								<div
									key={index}
									className='w-[50%] shrink-0 space-y-2 rounded-xl border border-border/70 bg-card pb-2 shadow-sm'>
									<Skeleton className='h-34 w-full rounded-t-xl' />
									<div className='space-y-2 px-2.5 pt-1'>
										<Skeleton className='h-4 w-full' />
										<Skeleton className='h-4 w-2/3' />
										<Skeleton className='h-5 w-20' />
										<Skeleton className='h-7 w-full rounded-md' />
									</div>
								</div>
							))}
						</div>
					</Container>
				</section>
			))}
		</>
	);
}
