"use client";

import { useState } from "react";
import { CreditCard, Plus, Star, Trash2, Wallet, X } from "lucide-react";
import { cn } from "cn";
import { Button, formatCurrency } from "@/shared";
import { useWalletStore } from "../stores/useWalletStore";
import {
	cardBrandLabels,
	detectCardBrand,
	formatCardNumberInput,
	formatExpiryInput,
	isValidExpiry,
} from "../lib/card";
import type { CardBrand } from "../schema";

const inputClass =
	"h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/40";

/** A small wordmark so each saved card is recognisable at a glance. */
function BrandMark({ brand }: { brand: CardBrand }) {
	const label = cardBrandLabels[brand];

	return (
		<span className='rounded-md bg-background px-2 py-1 text-[10px] font-bold tracking-wide text-foreground uppercase ring-1 ring-border'>
			{label}
		</span>
	);
}

export function PaymentWallet() {
	const balance = useWalletStore((state) => state.balance);
	const cards = useWalletStore((state) => state.cards);
	const addCard = useWalletStore((state) => state.addCard);
	const removeCard = useWalletStore((state) => state.removeCard);
	const setDefaultCard = useWalletStore((state) => state.setDefaultCard);

	const [isAdding, setIsAdding] = useState(false);
	const [number, setNumber] = useState("");
	const [expiry, setExpiry] = useState("");
	const [name, setName] = useState("");
	const [error, setError] = useState<string | null>(null);

	const digits = number.replace(/\D/g, "");

	const closeForm = () => {
		setIsAdding(false);
		setNumber("");
		setExpiry("");
		setName("");
		setError(null);
	};

	const submit = () => {
		if (digits.length < 12) {
			setError("Enter a valid card number.");
			return;
		}
		if (!isValidExpiry(expiry)) {
			setError("Enter the expiry as MM/YY.");
			return;
		}
		if (!name.trim()) {
			setError("Enter the name on the card.");
			return;
		}

		addCard({
			brand: detectCardBrand(digits),
			last4: digits.slice(-4),
			expiry,
			makeDefault: cards.length === 0,
		});
		closeForm();
	};

	return (
		<div className='space-y-3'>
			<section className='relative overflow-hidden rounded-3xl bg-foreground p-6 text-background shadow-lg'>
				<div
					aria-hidden
					className='absolute -right-8 -top-10 size-32 rounded-full bg-primary/30 blur-2xl'
				/>
				<div className='relative flex items-center justify-between'>
					<div className='flex items-center gap-2 text-xs font-medium tracking-wide uppercase opacity-80'>
						<Wallet className='size-4' />
						Wallet balance
					</div>
					<CreditCard className='size-5 opacity-60' aria-hidden />
				</div>
				<p className='relative mt-4 text-3xl font-bold tracking-tight'>
					{formatCurrency(balance)}
				</p>
				<p className='relative mt-1 text-xs opacity-70'>
					Store credit, refunds and promo cashback appear here.
				</p>
				<button
					type='button'
					disabled
					title='Top-ups are not available yet'
					className='relative mt-4 inline-flex h-9 items-center rounded-full bg-background/10 px-4 text-xs font-semibold opacity-60'>
					Top up (coming soon)
				</button>
			</section>

			<section className='rounded-3xl border border-border/80 bg-card p-4 shadow-sm'>
				<div className='flex items-center justify-between'>
					<div>
						<h2 className='text-sm font-semibold text-foreground'>
							Saved cards
						</h2>
						<p className='text-xs text-muted-foreground'>
							Only the last 4 digits are kept on this device.
						</p>
					</div>
					{!isAdding ? (
						<button
							type='button'
							onClick={() => setIsAdding(true)}
							className='flex size-9 items-center justify-center rounded-full bg-primary text-foreground-inverse'>
							<Plus className='size-4' />
							<span className='sr-only'>Add a card</span>
						</button>
					) : null}
				</div>

				{cards.length === 0 && !isAdding ? (
					<div className='mt-3 flex flex-col items-center rounded-2xl border border-dashed border-border px-4 py-8 text-center'>
						<span className='flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground'>
							<CreditCard className='size-5' aria-hidden />
						</span>
						<p className='mt-3 text-sm font-semibold text-foreground'>
							No saved cards
						</p>
						<p className='mt-1 max-w-[16rem] text-xs leading-relaxed text-muted-foreground'>
							Add a card to see it here. Payments still run securely on Stripe
							at checkout.
						</p>
						<Button
							type='button'
							variant='outline'
							onClick={() => setIsAdding(true)}
							className='mt-4 h-10 rounded-full'>
							<Plus className='size-4' />
							Add a card
						</Button>
					</div>
				) : null}

				<ul className='mt-3 space-y-2'>
					{cards.map((card) => (
						<li
							key={card.id}
							className={cn(
								"flex items-center gap-3 rounded-2xl border p-3",
								card.isDefault
									? "border-primary/40 bg-primary-subtle/40"
									: "border-border/80 bg-background",
							)}>
							<span className='flex size-10 shrink-0 items-center justify-center rounded-xl bg-foreground text-background'>
								<CreditCard className='size-4' />
							</span>

							<div className='min-w-0 flex-1'>
								<div className='flex items-center gap-2'>
									<BrandMark brand={card.brand} />
									{card.isDefault ? (
										<span className='text-[10px] font-semibold text-primary'>
											Default
										</span>
									) : null}
								</div>
								<p className='mt-1 font-mono text-sm tracking-widest text-foreground'>
									•••• •••• •••• {card.last4}
								</p>
								<p className='text-[11px] text-muted-foreground'>
									Expires {card.expiry}
								</p>
							</div>

							<div className='flex flex-col items-end gap-1'>
								{!card.isDefault ? (
									<button
										type='button'
										aria-label='Make this card the default'
										onClick={() => setDefaultCard(card.id)}
										className='flex size-7 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-primary'>
										<Star className='size-3.5' />
									</button>
								) : null}
								<button
									type='button'
									aria-label={`Remove card ending ${card.last4}`}
									onClick={() => removeCard(card.id)}
									className='flex size-7 items-center justify-center rounded-full text-muted-foreground hover:bg-danger-muted hover:text-danger'>
									<Trash2 className='size-3.5' />
								</button>
							</div>
						</li>
					))}
				</ul>

				{isAdding ? (
					<form
						className='mt-3 space-y-3 border-t border-border/80 pt-3'
						onSubmit={(event) => {
							event.preventDefault();
							submit();
						}}>
						<div className='flex items-center justify-between'>
							<h3 className='text-sm font-semibold text-foreground'>
								Add a card
							</h3>
							<button
								type='button'
								aria-label='Cancel'
								onClick={closeForm}
								className='flex size-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted'>
								<X className='size-4' />
							</button>
						</div>

						<div className='space-y-1'>
							<label
								htmlFor='card-number'
								className='text-xs font-medium text-foreground'>
								Card number
							</label>
							<input
								id='card-number'
								inputMode='numeric'
								autoComplete='cc-number'
								value={number}
								placeholder='4242 4242 4242 4242'
								onChange={(event) =>
									setNumber(formatCardNumberInput(event.target.value))
								}
								className={inputClass}
							/>
						</div>

						<div className='grid grid-cols-2 gap-2'>
							<div className='space-y-1'>
								<label
									htmlFor='card-expiry'
									className='text-xs font-medium text-foreground'>
									Expiry
								</label>
								<input
									id='card-expiry'
									inputMode='numeric'
									autoComplete='cc-exp'
									value={expiry}
									placeholder='MM/YY'
									onChange={(event) =>
										setExpiry(formatExpiryInput(event.target.value))
									}
									className={inputClass}
								/>
							</div>
							<div className='space-y-1'>
								<label
									htmlFor='card-name'
									className='text-xs font-medium text-foreground'>
									Name on card
								</label>
								<input
									id='card-name'
									autoComplete='cc-name'
									value={name}
									placeholder='ADA OBI'
									onChange={(event) => setName(event.target.value)}
									className={inputClass}
								/>
							</div>
						</div>

						{error ? (
							<p
								role='alert'
								className='rounded-xl border border-error-border bg-error-muted px-3 py-2 text-xs text-error-foreground'>
								{error}
							</p>
						) : null}

						<Button type='submit' className='h-11 w-full rounded-full'>
							Save card
						</Button>
						<p className='text-[11px] leading-relaxed text-muted-foreground'>
							This only stores the network, last 4 digits and expiry for your
							records. Full card details are never saved; payments are handled
							by Stripe.
						</p>
					</form>
				) : null}
			</section>
		</div>
	);
}
