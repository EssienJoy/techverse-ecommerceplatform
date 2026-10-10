import { Button, formatCurrency } from "@/shared";
import { ShieldCheck, Truck, ArrowRight } from "lucide-react";

type CartSummaryProps = {
	subtotal: number;
};

export function CartSummary({ subtotal }: CartSummaryProps) {
	const shipping = subtotal > 300 ? 0 : 19;
	const tax = subtotal * 0.08;
	const total = subtotal + shipping + tax;

	return (
		<div className='rounded-3xl border border-border/80 bg-card p-4 shadow-sm ring-1 ring-border/60 sm:p-5'>
			<div className='flex items-center justify-between'>
				<div>
					<p className='text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground'>
						Summary
					</p>
					<h2 className='mt-1 text-xl font-semibold text-foreground'>
						Order total
					</h2>
				</div>
				<div className='rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700'>
					{shipping === 0 ? "Free shipping" : "Shipping"}
				</div>
			</div>

			<div className='mt-5 space-y-3 text-sm'>
				<div className='flex items-center justify-between text-muted-foreground'>
					<span>Subtotal</span>
					<span className='font-medium text-foreground'>
						{formatCurrency(subtotal)}
					</span>
				</div>
				<div className='flex items-center justify-between text-muted-foreground'>
					<span>Shipping</span>
					<span className='font-medium text-foreground'>
						{shipping === 0 ? "Free" : formatCurrency(shipping)}
					</span>
				</div>
				<div className='flex items-center justify-between text-muted-foreground'>
					<span>Estimated tax</span>
					<span className='font-medium text-foreground'>
						{formatCurrency(tax)}
					</span>
				</div>
			</div>

			<div className='mt-5 rounded-2xl bg-muted/50 p-3'>
				<div className='flex items-center justify-between'>
					<span className='text-sm text-muted-foreground'>Total</span>
					<span className='text-xl font-bold text-primary'>
						{formatCurrency(total)}
					</span>
				</div>
			</div>

			<div className='grid'>
				<Button>
					Proceed to checkout
					<ArrowRight className='size-4' />
				</Button>
			</div>

			<div className='mt-4 space-y-2 border-t border-border pt-4'>
				<div className='flex items-center gap-2 text-xs text-muted-foreground'>
					<ShieldCheck className='size-4 text-emerald-600' />
					Secure checkout protected by SSL
				</div>
				<div className='flex items-center gap-2 text-xs text-muted-foreground'>
					<Truck className='size-4 text-brand-600' />
					Free returns within 30 days
				</div>
			</div>
		</div>
	);
}
