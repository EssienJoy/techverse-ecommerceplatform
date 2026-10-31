import { redirect } from "next/navigation";
import { Container } from "@/shared";
import {
	ProfileForm,
	ProfileHeader,
	ProfileIdentity,
	UpdatePasswordForm,
} from "@/features/account";
import { getCurrentUser } from "@/features/auth/server/user.service";

export const instant = false;

export const metadata = { title: "Account Overview" };

export default async function ProfileAccountPage() {
	const user = await getCurrentUser();
	if (!user) redirect("/login?next=%2Fprofile%2Faccount");

	return (
		<div>
			<ProfileHeader title='Account overview' subtitle='Your details' />

			<Container className='space-y-6'>
				<ProfileIdentity
					name={user.name}
					email={user.email}
					role={user.role}
					memberSince={user.createdAt}
				/>

				<ProfileForm
					defaultValues={{
						name: user.name ?? "",
						email: user.email,
					}}
				/>

				<UpdatePasswordForm />
			</Container>
		</div>
	);
}
