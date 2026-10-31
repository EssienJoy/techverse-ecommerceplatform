import { Container } from "@/shared";
import { ProfileHeader } from "@/features/account";
import { SavedList } from "@/features/saved";

export const metadata = { title: "Wishlist" };

export default function ProfileWishlistPage() {
	return (
		<div>
			<ProfileHeader title='Wishlist' subtitle='Saved for later' />

			<Container className='space-y-6'>
				<p className='text-sm text-muted-foreground'>
					Everything you saved from the shop. Prices update automatically.
				</p>

				<SavedList />
			</Container>
		</div>
	);
}
