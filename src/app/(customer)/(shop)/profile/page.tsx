import { redirect } from "next/navigation";
import { Container } from "@/shared";
import {
	LogoutButton,
	ProfileHeader,
	ProfileIdentity,
	ProfileMenu,
	ProfileStats,
} from "@/features/account";
import { getCurrentUser } from "@/features/auth/server/user.service";

// Reading the session cookie is uncached data, so this route must block rather
// than prerender.
export const instant = false;

export const metadata = { title: "My Profile" };

export default async function ProfilePage() {
	const user = await getCurrentUser();
	if (!user) redirect("/login?next=%2Fprofile");

	return (
		<div className='pb-4'>
			<ProfileHeader
				title='My account'
				subtitle='Shopping, wallet and preferences'
				back={false}
			/>

			<Container className='space-y-6'>
				<ProfileIdentity
					name={user.name}
					email={user.email}
					role={user.role}
					memberSince={user.createdAt}
				/>

				<ProfileStats />

				<ProfileMenu />

				<LogoutButton />

				<p className='pb-2 text-center text-[11px] text-muted-foreground'>
					Signed in as {user.email}
				</p>
			</Container>
		</div>
	);
}
