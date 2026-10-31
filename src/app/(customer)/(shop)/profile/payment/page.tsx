import { Container } from "@/shared";
import { PaymentWallet, ProfileHeader } from "@/features/account";

export const metadata = { title: "Payment & Wallet" };

export default function ProfilePaymentPage() {
	return (
		<div>
			<ProfileHeader title='Payment & wallet' subtitle='Cards and credit' />

			<Container className='space-y-6'>
				<p className='text-sm text-muted-foreground'>
					Manage your store credit and the cards saved on this device.
				</p>

				<PaymentWallet />
			</Container>
		</div>
	);
}
