import { Container } from "@/shared";
import { ProfileHeader } from "@/features/account";
import { OrderHistory } from "@/features/orders";

export const metadata = { title: "My Orders" };

export default function ProfileOrdersPage() {
	return (
		<div>
			<ProfileHeader title='My orders' subtitle='History and tracking' />

			<Container className='space-y-6'>
				<p className='text-sm text-muted-foreground'>
					Orders placed on this device appear here. Open one to see its
					delivery progress.
				</p>

				<OrderHistory />
			</Container>
		</div>
	);
}
