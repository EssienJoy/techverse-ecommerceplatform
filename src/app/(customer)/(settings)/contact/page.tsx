import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Button, Input, siteConfig } from "@/shared";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";

const whatsappNumber = "2348000000000";
const whatsappHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
	"Hi TechNest, I need help with an order.",
)}`;

const details = [
	{ icon: Mail, label: "Email", value: "support@technest.com" },
	{ icon: Phone, label: "Phone", value: "+234 800 000 0000" },
	{ icon: MapPin, label: "Address", value: "12 Admiralty Way, Lekki, Lagos" },
];

export default function ContactPage() {
	return (
		<>
			<p className='mt-2 text-sm text-muted-foreground'>
				Questions about an order or a product? Reach out and the{" "}
				{siteConfig.name} team will get back to you.
			</p>

			<a
				href={whatsappHref}
				target='_blank'
				rel='noopener noreferrer'
				className='mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#25D366] text-sm font-medium text-white transition-colors hover:bg-[#1ebe5b]'>
				<MessageCircle className='size-4' />
				Chat on WhatsApp
			</a>

			<ul className='mt-4 flex flex-col gap-3'>
				{details.map(({ icon: Icon, label, value }) => (
					<li
						key={label}
						className='flex items-center gap-3 rounded-2xl border border-border/80 bg-card p-3 shadow-sm'>
						<span className='flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-primary'>
							<Icon className='size-4' />
						</span>
						<div>
							<p className='text-xs text-muted-foreground'>{label}</p>
							<p className='text-sm font-medium text-foreground'>{value}</p>
						</div>
					</li>
				))}
			</ul>

			<form className='mt-4 flex flex-col gap-3 rounded-3xl border border-border/80 bg-card p-4 shadow-sm'>
				<div className='flex flex-col gap-2'>
					<Label htmlFor='contact-name' className='text-xs'>
						Name
					</Label>
					<Input
						id='contact-name'
						name='name'
						placeholder='Your name'
						className='h-9 rounded-xl bg-white dark:bg-input/30'
					/>
				</div>
				<div className='flex flex-col gap-2'>
					<Label htmlFor='contact-email' className='text-xs'>
						Email
					</Label>
					<Input
						id='contact-email'
						name='email'
						type='email'
						placeholder='you@example.com'
						className='h-9 rounded-xl bg-white dark:bg-input/30'
					/>
				</div>
				<div className='flex flex-col gap-2'>
					<Label htmlFor='contact-message' className='text-xs'>
						Message
					</Label>
					<Textarea
						id='contact-message'
						name='message'
						placeholder='How can we help?'
						className='rounded-xl bg-white dark:bg-input/30'
					/>
				</div>
				<Button type='submit' className='mt-1 h-10 rounded-full'>
					Send message
				</Button>
			</form>
		</>
	);
}