import { formatCurrency } from "@/shared";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

type CartSummaryProps = {
	subtotal: number;
};

export function CartSummary({ subtotal }: CartSummaryProps) {
	const shipping = subtotal > 300 ? 0 : 19;
	const tax = subtotal * 0.08;
	const total = subtotal + shipping + tax;

	return (
		<div className='flex flex-col py-4'>
			<div className='flex items-center justify-between'>
				<h2 className='text-xl font-semibold text-foreground'>Order total</h2>
				<span className='rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700'>
					{shipping === 0 ? "Free shipping" : "Shipping"}
				</span>
			</div>

			<div className='mt-2 divide-y divide-border'>
				<div className='flex items-center justify-between py-4 text-sm text-muted-foreground'>
					<span>Subtotal</span>
					<span className='font-medium text-foreground'>
						{formatCurrency(subtotal)}
					</span>
				</div>
				<div className='flex items-center justify-between py-4 text-sm text-muted-foreground'>
					<span>Shipping</span>
					<span className='font-medium text-foreground'>
						{shipping === 0 ? "Free" : formatCurrency(shipping)}
					</span>
				</div>
				<div className='flex items-center justify-between py-4 text-sm text-muted-foreground'>
					<span>Estimated tax</span>
					<span className='font-medium text-foreground'>
						{formatCurrency(tax)}
					</span>
				</div>
				<div className='flex items-center justify-between py-4'>
					<span className='text-sm font-semibold text-foreground'>Total</span>
					<span className='text-2xl font-bold text-primary'>
						{formatCurrency(total)}
					</span>
				</div>
			</div>

			<Link
				href='/checkout'
				className='mt-6 inline-flex h-12 items-center justify-center gap-1.5 rounded-full bg-primary px-2.5 text-base font-medium whitespace-nowrap text-foreground-inverse transition-all hover:bg-primary/80 active:translate-y-px'>
				Proceed to checkout
				<ArrowRight className='size-4' />
			</Link>
		</div>
	);
}