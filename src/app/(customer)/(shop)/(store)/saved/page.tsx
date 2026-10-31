"use client";

import { Container } from "@/shared";
import { Header } from "@/features/navigation";
import { SavedList } from "@/features/saved";
import { useFavoritesStore } from "@/features/saved/stores/useFavoritesStore";
import { BadgeCheck, Sparkles } from "lucide-react";

export default function SavedPage() {
	const favorites = useFavoritesStore((state) => state.favorites);

	return (
		<>
			<Header
				text='Saved'
				number={String(favorites.length)}
				showBack={false}
				saved
			/>

			<section>
				<Container>
					<div className='mb-4 flex items-start gap-3 rounded-2xl border border-border/80 bg-card px-4 py-3 shadow-sm'>
						<span className='flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-subtle text-primary'>
							<Sparkles className='size-4' aria-hidden />
						</span>
						<div className='text-xs leading-relaxed text-muted-foreground'>
							<p className='font-medium text-foreground'>
								Your shortlist, kept in sync
							</p>
							<p className='flex items-center gap-1'>
								<BadgeCheck className='size-3 shrink-0 text-success' aria-hidden />
								Prices update automatically. Unavailable items are removed.
							</p>
						</div>
					</div>

					<SavedList />
				</Container>
			</section>
		</>
	);
}
