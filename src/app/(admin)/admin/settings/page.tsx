import { siteConfig } from "@/shared";
import { Button, Input } from "@/shared";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/shared/components/ui/card";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { ImageUpload, PageHeader } from "@/features/admin";
import { AdminHeader } from "@/features/admin/components/AdminHeader";

export default function AdminSettingsPage() {
	return (
		<>
			<AdminHeader title='Settings' />
			<div className='flex flex-1 flex-col gap-6 p-gutter pb-24'>
				<PageHeader description='Manage your store details and branding.' />

				<div className='grid gap-4 lg:grid-cols-2'>
					<Card>
						<CardHeader>
							<CardTitle>Store details</CardTitle>
							<CardDescription>
								Basic information shown across the store.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<form className='flex flex-col gap-4'>
								<div className='flex flex-col gap-2'>
									<Label htmlFor='store-name'>Store name</Label>
									<Input
										id='store-name'
										name='storeName'
										defaultValue={siteConfig.name}
									/>
								</div>
								<div className='flex flex-col gap-2'>
									<Label htmlFor='support-email'>Support email</Label>
									<Input
										id='support-email'
										name='supportEmail'
										type='email'
										placeholder='support@example.com'
									/>
								</div>
								<div className='flex flex-col gap-2'>
									<Label htmlFor='about'>About</Label>
									<Textarea
										id='about'
										name='about'
										placeholder='Tell customers about your store...'
									/>
								</div>
								<div className='flex justify-end'>
									<Button type='submit'>Save changes</Button>
								</div>
							</form>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Branding</CardTitle>
							<CardDescription>
								Upload your logo and store banner.
							</CardDescription>
						</CardHeader>
						<CardContent className='flex flex-col gap-4'>
							<div className='flex flex-col gap-2'>
								<Label>Logo</Label>
								<ImageUpload
									label='Upload logo'
									hint='Square image, PNG or SVG up to 2MB'
								/>
							</div>
							<div className='flex flex-col gap-2'>
								<Label>Store banner</Label>
								<ImageUpload
									label='Upload banner'
									hint='Wide image, 1600x400 recommended'
								/>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</>
	);
}
