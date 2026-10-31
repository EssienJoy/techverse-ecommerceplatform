import {
	Mail,
	MapPin,
	MessageCircle,
	Phone,
	ShieldCheck,
	Truck,
	Undo2,
} from "lucide-react";
import { Container } from "@/shared";
import { ProfileHeader } from "@/features/account";

const whatsappNumber = "2348000000000";
const whatsappHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
	"Hi TechNest, I need help with an order.",
)}`;

const details = [
	{
		icon: Mail,
		label: "Email",
		value: "support@technest.com",
		href: "mailto:support@technest.com",
	},
	{
		icon: Phone,
		label: "Phone",
		value: "+234 800 000 0000",
		href: "tel:+2348000000000",
	},
	{
		icon: MapPin,
		label: "Address",
		value: "12 Admiralty Way, Lekki, Lagos",
		href: undefined,
	},
];

const helpTopics = [
	{
		icon: Truck,
		title: "Delivery",
		description: "Orders arrive in 3–5 business days across Lagos.",
	},
	{
		icon: Undo2,
		title: "Returns",
		description: "Unopened items can be returned within 7 days.",
	},
	{
		icon: ShieldCheck,
		title: "Warranty",
		description: "Every device includes a 12-month warranty.",
	},
];

export const metadata = { title: "Support" };

export default function ProfileSupportPage() {
	return (
		<div>
			<ProfileHeader title='Support' subtitle='We are here to help' />

			<Container className='space-y-6'>
				<a
					href={whatsappHref}
					target='_blank'
					rel='noopener noreferrer'
					className='flex h-12 items-center justify-center gap-2 rounded-full bg-[#25D366] text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90'>
					<MessageCircle className='size-4' aria-hidden />
					Chat on WhatsApp
				</a>

				<section className='overflow-hidden rounded-3xl border border-border/80 bg-card shadow-sm'>
					<div className='border-b border-border/80 px-4 py-3'>
						<h2 className='text-sm font-semibold text-foreground'>
							Contact details
						</h2>
						<p className='text-xs text-muted-foreground'>
							We usually reply within one business day.
						</p>
					</div>

					<ul className='divide-y divide-border/80'>
						{details.map(({ icon: Icon, label, value, href }) => (
							<li
								key={label}
								className='flex items-center gap-3 px-4 py-4'>
								<span className='flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary-subtle text-primary'>
									<Icon className='size-4' aria-hidden />
								</span>
								<div className='min-w-0'>
									<p className='text-[11px] font-medium tracking-wide text-muted-foreground uppercase'>
										{label}
									</p>
									{href ? (
										<a
											href={href}
											className='block truncate text-sm font-medium text-foreground hover:text-primary'>
											{value}
										</a>
									) : (
										<p className='truncate text-sm font-medium text-foreground'>
											{value}
										</p>
									)}
								</div>
							</li>
						))}
					</ul>
				</section>

				<section className='space-y-2'>
					<h2 className='px-1 text-[11px] font-semibold tracking-[0.14em] text-muted-foreground uppercase'>
						Common questions
					</h2>

					<ul className='divide-y divide-border/80 overflow-hidden rounded-3xl border border-border/80 bg-card shadow-sm'>
						{helpTopics.map(({ icon: Icon, title, description }) => (
							<li key={title} className='flex gap-3 px-4 py-4'>
								<span className='flex size-9 shrink-0 items-center justify-center rounded-xl bg-surface-muted text-foreground'>
									<Icon className='size-4' aria-hidden />
								</span>
								<div>
									<p className='text-sm font-medium text-foreground'>{title}</p>
									<p className='mt-1 text-xs leading-relaxed text-muted-foreground'>
										{description}
									</p>
								</div>
							</li>
						))}
					</ul>
				</section>
			</Container>
		</div>
	);
}
