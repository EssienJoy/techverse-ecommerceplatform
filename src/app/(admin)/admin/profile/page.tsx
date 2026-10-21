import { UserPlus } from "lucide-react";
import { redirect } from "next/navigation";
import { Badge } from "@/shared/components/ui/badge";
import { buttonVariants } from "@/shared/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/shared/components/ui/card";
import { Label } from "@/shared/components/ui/label";
import { Button, Input, Link } from "@/shared";
import { PageHeader } from "@/features/admin";
import { AdminHeader } from "@/features/admin/components/AdminHeader";
import { getCurrentUser } from "@/features/auth/server/current-user";

const getInitials = (name: string) =>
	name
		.split(" ")
		.map((part) => part.charAt(0))
		.slice(0, 2)
		.join("")
		.toUpperCase();

export default async function AdminProfilePage() {
	const user = await getCurrentUser();

	if (!user) {
		redirect("/admin/login");
	}

	const roleLabel =
		user.role === "super_admin" ? "Super admin" : "Administrator";

	return (
		<>
			<AdminHeader title='Profile' />
			<div className='flex flex-1 flex-col gap-6 p-4 pb-24 md:p-6'>
				<div className='flex flex-wrap items-center justify-between gap-3'>
					<PageHeader description='Manage your admin account details and password.' />
					{user.role === "super_admin" ? (
						<Link
							href='/admin/signup'
							className={buttonVariants({ variant: "outline", size: "sm" })}>
							<UserPlus className='size-4' />
							Create admin
						</Link>
					) : null}
				</div>

				<div className='grid gap-4 lg:grid-cols-3'>
					<Card>
						<CardContent className='flex flex-col items-center gap-3 text-center'>
							<span className='flex size-20 items-center justify-center rounded-full bg-primary text-2xl font-bold text-foreground-inverse'>
								{getInitials(user.name)}
							</span>
							<div>
								<p className='text-lg font-semibold'>{user.name}</p>
								<p className='text-sm text-muted-foreground'>{user.email}</p>
							</div>
							<Badge variant='secondary'>{roleLabel}</Badge>
						</CardContent>
					</Card>

					<Card className='lg:col-span-2'>
						<CardHeader>
							<CardTitle>Personal information</CardTitle>
							<CardDescription>Update your account details.</CardDescription>
						</CardHeader>
						<CardContent>
							<form className='flex flex-col gap-4'>
								<div className='grid gap-4 sm:grid-cols-2'>
									<div className='flex flex-col gap-2'>
										<Label htmlFor='profile-name'>Full name</Label>
										<Input
											id='profile-name'
											name='name'
											defaultValue={user.name}
										/>
									</div>
									<div className='flex flex-col gap-2'>
										<Label htmlFor='profile-email'>Email</Label>
										<Input
											id='profile-email'
											name='email'
											type='email'
											defaultValue={user.email}
										/>
									</div>
									<div className='flex flex-col gap-2'>
										<Label htmlFor='profile-role'>Role</Label>
										<Input
											id='profile-role'
											name='role'
											defaultValue={roleLabel}
											disabled
										/>
									</div>
								</div>

								<div className='flex justify-end'>
									<Button type='submit'>Save changes</Button>
								</div>
							</form>
						</CardContent>
					</Card>
				</div>

				<Card>
					<CardHeader>
						<CardTitle>Password</CardTitle>
						<CardDescription>
							Update the password used to sign in to the admin console.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form className='flex flex-col gap-4'>
							<div className='grid gap-4 sm:grid-cols-3'>
								<div className='flex flex-col gap-2'>
									<Label htmlFor='profile-current-password'>
										Current password
									</Label>
									<Input
										id='profile-current-password'
										name='currentPassword'
										type='password'
										placeholder='••••••••'
									/>
								</div>
								<div className='flex flex-col gap-2'>
									<Label htmlFor='profile-new-password'>New password</Label>
									<Input
										id='profile-new-password'
										name='newPassword'
										type='password'
										placeholder='••••••••'
									/>
								</div>
								<div className='flex flex-col gap-2'>
									<Label htmlFor='profile-confirm-password'>
										Confirm password
									</Label>
									<Input
										id='profile-confirm-password'
										name='confirmPassword'
										type='password'
										placeholder='••••••••'
									/>
								</div>
							</div>
							<div className='flex justify-end'>
								<Button type='submit' variant='outline'>
									Update password
								</Button>
							</div>
						</form>
					</CardContent>
				</Card>
			</div>
		</>
	);
}
