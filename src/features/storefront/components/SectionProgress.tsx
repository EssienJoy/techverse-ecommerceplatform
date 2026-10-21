"use client";

import { useEffect, useState } from "react";

type SectionProgressProps = {
	trackId: string;
	total: number;
	pageSize: number;
};

export function SectionProgress({
	trackId,
	total,
	pageSize,
}: SectionProgressProps) {
	const pages = Math.ceil(total / pageSize);
	const scrollable = pages > 1;
	const [shown, setShown] = useState(Math.min(total, pageSize));

	useEffect(() => {
		if (!scrollable) {
			return;
		}

		const track = document.getElementById(trackId);
		if (!track) {
			return;
		}

		const update = () => {
			const currentPage = Math.min(
				pages - 1,
				Math.round(track.scrollLeft / track.clientWidth)
			);
			setShown(Math.min(total, (currentPage + 1) * pageSize));
		};

		track.addEventListener("scroll", update, { passive: true });
		window.addEventListener("resize", update);

		return () => {
			track.removeEventListener("scroll", update);
			window.removeEventListener("resize", update);
		};
	}, [trackId, scrollable, pages, total, pageSize]);

	if (!scrollable) {
		return null;
	}

	return (
		<div className='mt-2 flex justify-end'>
			<span className='text-[0.6875rem] text-muted-foreground'>
				{shown} / {total}
			</span>
		</div>
	);
}
