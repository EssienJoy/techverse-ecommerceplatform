import { redirect } from "next/navigation";
import { getCurrentUser } from "@/features/auth/server/user.service";
import { ProfileForm } from "@/features/account/components/ProfileForm";
import { UpdatePasswordForm } from "@/features/account/components/UpdatePasswordForm";

export const metadata = { title: "My Profile" };

export default async function ProfilePage() {
	const user = await getCurrentUser();
	if (!user) redirect("/login");

	return (
		<main className='mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 lg:px-8'>
			<header className='mb-8'>
				<h1 className='font-heading text-2xl font-semibold text-foreground'>
					My Profile
				</h1>
				<p className='mt-1 text-sm text-foreground-subtle'>
					Manage your account details and password.
				</p>
			</header>

			{/* Avatar + identity */}
			<section className='mb-6 flex items-center gap-4 rounded-xl border border-border bg-card p-5 shadow-sm'>
				<div
					aria-hidden
					className='flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary-subtle text-lg font-semibold text-foreground-primary'>
					{(user.name?.[0] ?? user.email[0]).toUpperCase()}
				</div>
				<div className='min-w-0'>
					<p className='truncate font-medium text-card-foreground'>
						{user.name ?? "Unnamed user"}
					</p>
					<p className='truncate text-sm text-foreground-muted'>{user.email}</p>
					<span className='mt-1 inline-block rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground'>
						{user.role.replace("_", " ")}
					</span>
				</div>
			</section>

			<div className='space-y-6'>
				<ProfileForm
					defaultValues={{
						name: user.name ?? "",
						email: user.email,
					}}
				/>
				<UpdatePasswordForm />
			</div>
		</main>
	);
}
