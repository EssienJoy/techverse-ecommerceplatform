"use client";

import { useEffect, useState } from "react";

const DURATION = 6 * 60 * 60 * 1000;

function pad(value: number) {
	return String(value).padStart(2, "0");
}

export function DealCountdown() {
	const [remaining, setRemaining] = useState(DURATION);

	useEffect(() => {
		const end = Date.now() + DURATION;
		const id = setInterval(() => {
			setRemaining(Math.max(0, end - Date.now()));
		}, 1000);

		return () => clearInterval(id);
	}, []);

	const total = Math.floor(remaining / 1000);
	const hours = pad(Math.floor(total / 3600));
	const minutes = pad(Math.floor((total % 3600) / 60));
	const seconds = pad(total % 60);

	return (
		<div className='flex items-center gap-1 rounded-lg bg-white/15 px-2 py-1 text-xs font-semibold text-white ring-1 ring-white/20 backdrop-blur tabular-nums'>
			<span>{hours}</span>
			<span className='text-white/50'>:</span>
			<span>{minutes}</span>
			<span className='text-white/50'>:</span>
			<span>{seconds}</span>
		</div>
	);
}
