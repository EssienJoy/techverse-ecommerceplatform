import { Container } from "@/shared";
import { AddressBook, ProfileHeader } from "@/features/account";

export const metadata = { title: "Addresses" };

export default function ProfileAddressPage() {
	return (
		<div>
			<ProfileHeader title='Addresses' subtitle='Delivery details' />

			<Container className='space-y-6'>
				<p className='text-sm text-muted-foreground'>
					Save the places you order to. One address is always the default used
					at checkout.
				</p>

				<AddressBook />
			</Container>
		</div>
	);
}
