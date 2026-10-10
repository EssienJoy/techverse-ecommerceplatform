import { Mail, MapPin, Phone } from "lucide-react";
import { Button, Container, Input, siteConfig } from "@/shared";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";

const details = [
	{
		icon: Mail,
		label: "Email",
		value: "support@technest.com",
	},
	{
		icon: Phone,
		label: "Phone",
		value: "+234 800 000 0000",
	},
	{
		icon: MapPin,
		label: "Address",
		value: "12 Admiralty Way, Lekki, Lagos",
	},
];

export default function ContactPage() {
	return (
		<Container className='py-4'>
			<h1 className='text-xl font-bold'>Contact us</h1>
			<p className='mt-2 text-sm text-muted-foreground'>
				Questions about an order or a product? Reach out and the{" "}
				{siteConfig.name} team will get back to you.
			</p>

			<ul className='mt-4 flex flex-col gap-3'>
				{details.map(({ icon: Icon, label, value }) => (
					<li
						key={label}
						className='flex items-center gap-3 rounded-2xl bg-card p-3'>
						<span className='flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-primary'>
							<Icon className='size-4' />
						</span>
						<div>
							<p className='text-xs text-muted-foreground'>{label}</p>
							<p className='text-sm font-medium'>{value}</p>
						</div>
					</li>
				))}
			</ul>

			<form className='mt-6 flex flex-col gap-4'>
				<div className='flex flex-col gap-2'>
					<Label htmlFor='name'>Name</Label>
					<Input id='name' name='name' placeholder='Your name' />
				</div>
				<div className='flex flex-col gap-2'>
					<Label htmlFor='email'>Email</Label>
					<Input
						id='email'
						name='email'
						type='email'
						placeholder='you@example.com'
					/>
				</div>
				<div className='flex flex-col gap-2'>
					<Label htmlFor='message'>Message</Label>
					<Textarea
						id='message'
						name='message'
						placeholder='How can we help?'
					/>
				</div>
				<Button type='submit'>Send message</Button>
			</form>
		</Container>
	);
}
