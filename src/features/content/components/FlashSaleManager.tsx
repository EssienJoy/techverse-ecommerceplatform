"use client";

import { useState, useTransition } from "react";
import type { FormEvent } from "react";
import { Plus, Tag, Trash2 } from "lucide-react";
import { Button, Input, formatCurrency } from "@/shared";
import { Badge } from "@/shared/components/ui/badge";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/shared/components/ui/card";
import { Label } from "@/shared/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/shared/components/ui/select";
import { Switch } from "@/shared/components/ui/switch";
import type { FlashSaleData } from "@/features/content/lib/flash-sale";
import {
	flashSaleSettingsAction,
	addFlashSaleItemAction,
	deleteFlashSaleItemAction,
	type ContentFormState,
} from "@/features/content/server/content.actions";

const initialState: ContentFormState = {};

export function FlashSaleManager({
	flashSale,
	products,
}: {
	flashSale: FlashSaleData;
	products: { id: string; name: string; price: number }[];
}) {
	const [headline, setHeadline] = useState(flashSale?.headline ?? "");
	const [endsAt, setEndsAt] = useState(
		flashSale ? flashSale.endsAt.slice(0, 16) : "",
	);
	const [active, setActive] = useState(flashSale?.isActive ?? false);
	const [selectedProduct, setSelectedProduct] = useState("");
	const [discount, setDiscount] = useState("");
	const [settingsState, setSettingsState] =
		useState<ContentFormState>(initialState);
	const [itemState, setItemState] = useState<ContentFormState>(initialState);
	const [isPending, startTransition] = useTransition();

	const handleSettingsSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		if (active) formData.set("active", "on");

		startTransition(async () => {
			const result = await flashSaleSettingsAction(initialState, formData);
			if (result.success) {
				setSettingsState(initialState);
			} else {
				setSettingsState(result);
			}
		});
	};

	const handleAddItem = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);

		startTransition(async () => {
			const result = await addFlashSaleItemAction(initialState, formData);
			if (result.success) {
				setItemState(initialState);
				setSelectedProduct("");
				setDiscount("");
			} else {
				setItemState(result);
			}
		});
	};

	const handleRemoveItem = (id: string) => {
		startTransition(async () => {
			await deleteFlashSaleItemAction(id);
		});
	};

	const settingsErrors = settingsState.fieldErrors ?? {};
	const itemErrors = itemState.fieldErrors ?? {};

	return (
		<>
			<Card>
				<CardHeader>
					<div className='flex items-center justify-between gap-3'>
						<CardTitle>Campaign</CardTitle>
						<div className='flex items-center gap-2 text-sm'>
							<Switch checked={active} onCheckedChange={setActive} />
							{active ? "Live" : "Off"}
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSettingsSubmit} className='flex flex-col gap-4'>
						<div className='grid gap-4 sm:grid-cols-2'>
							<div className='flex flex-col gap-2'>
								<Label htmlFor='sale-headline'>Headline</Label>
								<Input
									id='sale-headline'
									name='headline'
									value={headline}
									onChange={(event) => setHeadline(event.target.value)}
									placeholder='e.g. Up to 40% off'
									aria-invalid={Boolean(settingsErrors.headline)}
								/>
								{settingsErrors.headline?.[0] ? (
									<p className='text-xs text-danger'>
										{settingsErrors.headline[0]}
									</p>
								) : null}
							</div>
							<div className='flex flex-col gap-2'>
								<Label htmlFor='sale-ends'>Ends at</Label>
								<Input
									id='sale-ends'
									name='endsAt'
									type='datetime-local'
									value={endsAt}
									onChange={(event) => setEndsAt(event.target.value)}
									aria-invalid={Boolean(settingsErrors.endsAt)}
								/>
								{settingsErrors.endsAt?.[0] ? (
									<p className='text-xs text-danger'>
										{settingsErrors.endsAt[0]}
									</p>
								) : null}
							</div>
						</div>
						<div className='flex justify-end'>
							<Button type='submit' disabled={isPending}>
								{isPending ? "Saving…" : "Save campaign"}
							</Button>
						</div>
						{settingsState.formError ? (
							<p className='rounded-lg border border-danger/30 bg-danger-muted px-3 py-2 text-sm text-danger'>
								{settingsState.formError}
							</p>
						) : null}
					</form>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Sale items</CardTitle>
				</CardHeader>
				<CardContent className='flex flex-col gap-4'>
					<form
						onSubmit={handleAddItem}
						className='grid gap-3 sm:grid-cols-[1fr_140px_auto] sm:items-end'>
						<div className='flex flex-col gap-2'>
							<Label htmlFor='sale-product'>Product</Label>
							<Select
								value={selectedProduct}
								onValueChange={(value) => setSelectedProduct(value ?? "")}>
								<SelectTrigger id='sale-product' className='w-full'>
									<SelectValue placeholder='Choose a product' />
								</SelectTrigger>
								<SelectContent>
									{products.map((product) => (
										<SelectItem key={product.id} value={product.id}>
											{product.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<input
								type='hidden'
								name='productId'
								value={selectedProduct}
							/>
							{itemErrors.productId?.[0] ? (
								<p className='text-xs text-danger'>{itemErrors.productId[0]}</p>
							) : null}
						</div>
						<div className='flex flex-col gap-2'>
							<Label htmlFor='sale-discount'>Discount %</Label>
							<Input
								id='sale-discount'
								name='discount'
								type='number'
								min={1}
								max={90}
								value={discount}
								onChange={(event) => setDiscount(event.target.value)}
								placeholder='0'
								aria-invalid={Boolean(itemErrors.discount)}
							/>
							{itemErrors.discount?.[0] ? (
								<p className='text-xs text-danger'>{itemErrors.discount[0]}</p>
							) : null}
						</div>
						<Button
							type='submit'
							disabled={isPending || !selectedProduct || !discount}>
							<Plus />
							Add
						</Button>
					</form>

					{itemState.formError ? (
						<p className='rounded-lg border border-danger/30 bg-danger-muted px-3 py-2 text-sm text-danger'>
							{itemState.formError}
						</p>
					) : null}

					{!flashSale || flashSale.items.length === 0 ? (
						<div className='flex flex-col items-center gap-2 rounded-xl border border-dashed border-border py-8 text-center'>
							<Tag className='size-5 text-muted-foreground' />
							<p className='text-sm text-muted-foreground'>
								No products in this sale yet.
							</p>
						</div>
					) : (
						<ul className='flex flex-col divide-y divide-border'>
							{flashSale.items.map((item) => {
								const salePrice = Math.round(
									item.productPrice * (1 - item.discount / 100),
								);

								return (
									<li
										key={item.id}
										className='flex items-center gap-3 py-3'>
										<span className='flex size-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand-100 to-brand-300 text-xs font-bold text-brand-700'>
											{item.productName.charAt(0)}
										</span>
										<div className='min-w-0 flex-1'>
											<p className='truncate text-sm font-medium'>
												{item.productName}
											</p>
											<p className='text-xs text-muted-foreground'>
												<s>{formatCurrency(item.productPrice)}</s>{" "}
												<span className='font-medium text-foreground'>
													{formatCurrency(salePrice)}
												</span>
											</p>
										</div>
										<Badge variant='secondary'>-{item.discount}%</Badge>
										<Button
											variant='ghost'
											size='icon-sm'
											aria-label={`Remove ${item.productName}`}
											disabled={isPending}
											onClick={() => handleRemoveItem(item.id)}>
											<Trash2 />
										</Button>
									</li>
								);
							})}
						</ul>
					)}
				</CardContent>
			</Card>
		</>
	);
}
