import { formatCurrency } from "@/shared";
import { ArrowLeft, ArrowRight, ShieldCheck, Truck } from "lucide-react";
import Link from "next/link";

const FREE_SHIPPING_THRESHOLD = 300;
const SHIPPING_FEE = 19;
const TAX_RATE = 0.08;

type CartSummaryProps = {
	subtotal: number;
};

export function CartSummary({ subtotal }: CartSummaryProps) {
	const shipping =
		subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
	const tax = subtotal * TAX_RATE;
	const total = subtotal + shipping + tax;
	const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
	const progress = Math.min(
		100,
		(subtotal / FREE_SHIPPING_THRESHOLD) * 100,
	);

	return (
		<div className='rounded-3xl border border-border/80 bg-card p-4 shadow-sm'>
			<div className='flex items-center justify-between'>
				<h2 className='text-lg font-bold tracking-tight text-foreground'>
					Order summary
				</h2>
				<span className='rounded-full bg-brand-50 px-3 py-1 text-[11px] font-medium text-brand-700'>
					{shipping === 0 ? "Free delivery" : `${formatCurrency(shipping)} delivery`}
				</span>
			</div>

			<div className='mt-3 rounded-2xl bg-surface-muted p-3'>
				<div className='flex items-center justify-between gap-2 text-xs'>
					<span className='flex items-center gap-2 text-muted-foreground'>
						<Truck className='size-3.5 text-primary' aria-hidden />
						{remaining > 0 ? (
							<>
								Add{" "}
								<span className='font-semibold text-foreground'>
									{formatCurrency(remaining)}
								</span>{" "}
								for free delivery
							</>
						) : (
							<span className='font-semibold text-success'>
								Free delivery unlocked
							</span>
						)}
					</span>
					<span className='text-[10px] font-medium text-muted-foreground'>
						{Math.round(progress)}%
					</span>
				</div>

				<div className='mt-2 h-1.5 overflow-hidden rounded-full bg-border'>
					<div
						className='h-full rounded-full bg-primary transition-[width] duration-300'
						style={{ width: `${progress}%` }}
					/>
				</div>
			</div>

			<dl className='mt-3 divide-y divide-border/80'>
				<div className='flex items-center justify-between py-3 text-sm text-muted-foreground'>
					<dt>Subtotal</dt>
					<dd className='font-medium text-foreground'>
						{formatCurrency(subtotal)}
					</dd>
				</div>
				<div className='flex items-center justify-between py-3 text-sm text-muted-foreground'>
					<dt>Shipping</dt>
					<dd className='font-medium text-foreground'>
						{shipping === 0 ? "Free" : formatCurrency(shipping)}
					</dd>
				</div>
				<div className='flex items-center justify-between py-3 text-sm text-muted-foreground'>
					<dt>Estimated tax</dt>
					<dd className='font-medium text-foreground'>{formatCurrency(tax)}</dd>
				</div>
				<div className='flex items-center justify-between py-3'>
					<dt className='text-sm font-semibold text-foreground'>Total</dt>
					<dd className='text-2xl font-bold text-primary'>
						{formatCurrency(total)}
					</dd>
				</div>
			</dl>

			<Link
				href='/checkout'
				className='mt-2 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-4 text-base font-medium whitespace-nowrap text-foreground-inverse transition-all hover:bg-primary/80 active:translate-y-px'>
				Proceed to checkout
				<ArrowRight className='size-4' aria-hidden />
			</Link>

			<div className='mt-2 flex items-center justify-center gap-2 text-[11px] text-muted-foreground'>
				<ShieldCheck className='size-3.5 text-success' aria-hidden />
				Secure payment on Stripe
			</div>

			<Link
				href='/shop'
				className='mt-2 flex h-10 items-center justify-center gap-2 rounded-full text-sm font-medium text-muted-foreground transition-colors hover:text-primary'>
				<ArrowLeft className='size-4' aria-hidden />
				Continue shopping
			</Link>
		</div>
	);
}
