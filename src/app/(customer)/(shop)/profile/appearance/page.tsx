import { Container } from "@/shared";
import { AppearancePicker, ProfileHeader } from "@/features/account";

export const metadata = { title: "Appearance" };

export default function ProfileAppearancePage() {
	return (
		<div>
			<ProfileHeader title='Appearance' subtitle='Choose your theme' />

			<Container className='space-y-6'>
				<p className='text-sm text-muted-foreground'>
					Choose how the store looks to you. System follows your device
					setting.
				</p>

				<AppearancePicker />
			</Container>
		</div>
	);
}
