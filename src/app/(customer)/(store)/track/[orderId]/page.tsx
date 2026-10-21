import { Suspense } from "react";
import { TrackOrder } from "@/features/orders";

export default function TrackPage({
	params,
}: {
	params: Promise<{ orderId: string }>;
}) {
	return (
		<Suspense fallback={<div className='min-h-[60vh]' />}>
			<TrackContent params={params} />
		</Suspense>
	);
}

async function TrackContent({
	params,
}: {
	params: Promise<{ orderId: string }>;
}) {
	const { orderId } = await params;
	return <TrackOrder orderId={orderId} />;
}