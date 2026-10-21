"use client";

import { useActionState, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Eye, Layers, Tag } from "lucide-react";
import { Button, Input, formatCurrency, useAlertStore } from "@/shared";
import type { ProductFormValues, ProductVariationInput } from "@/shared/lib";
import { Badge } from "@/shared/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
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
import { Textarea } from "@/shared/components/ui/textarea";
import { cn } from "cn";

import {
	createProductAction,
	updateProductAction,
	type ProductFormState,
} from "@/features/products/server/products.actions";
import { ImageUpload } from "./ImageUpload";
import { ProductVariationsEditor } from "./ProductFormEditors";

type Option = { id: string; label: string };

type ProductFormProps = {
	categories?: Option[];
	brands?: Option[];
	initial?: ProductFormValues;
	onCancel: () => void;
};

const toSlug = (value: string) =>
	value
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");

const initialState: ProductFormState = {};

function FieldError({ message }: { message?: string }) {
	if (!message) return null;
	return <p className='text-xs text-danger'>{message}</p>;
}

function RequiredMark() {
	return <span className='text-danger'>*</span>;
}

function SectionTitle({
	icon: Icon,
	children,
}: {
	icon: typeof Tag;
	children: ReactNode;
}) {
	return (
		<CardTitle className='flex items-center gap-2'>
			<Icon className='size-4 text-muted-foreground' />
			{children}
		</CardTitle>
	);
}

function ProductForm({
	categories = [],
	brands = [],
	initial,
	onCancel,
}: ProductFormProps) {
	const action = initial ? updateProductAction : createProductAction;
	const [state, formAction, pending] = useActionState(action, initialState);
	const fieldErrors = state.fieldErrors ?? {};
	const showError = useAlertStore((store) => store.error);

	useEffect(() => {
		if (state.formError) showError(state.formError);
	}, [state, showError]);

	const [name, setName] = useState(initial?.name ?? "");
	const [slug, setSlug] = useState(initial?.slug ?? "");
	const [slugTouched, setSlugTouched] = useState(Boolean(initial));
	const [description, setDescription] = useState(initial?.description ?? "");
	const [categoryId, setCategoryId] = useState<string | null>(
		initial?.categoryId ?? null,
	);
	const [brandId, setBrandId] = useState<string | null>(
		initial?.brandId ?? null,
	);
	const [isActive, setIsActive] = useState(initial ? initial.isActive : true);
	const [imageUrl, setImageUrl] = useState(initial?.imageUrl ?? "");
	const [variations, setVariations] = useState<ProductVariationInput[]>(
		initial?.variations ?? [],
	);

	const handleNameChange = (value: string) => {
		setName(value);
		if (!slugTouched) setSlug(toSlug(value));
	};

	const categoryLabel =
		categories.find((item) => item.id === categoryId)?.label ?? null;
	const brandLabel = brands.find((item) => item.id === brandId)?.label ?? null;

	const prices = variations
		.map((variation) => variation.price)
		.filter((price) => Number.isFinite(price) && price >= 0);
	const minPrice = prices.length ? Math.min(...prices) : null;
	const maxPrice = prices.length ? Math.max(...prices) : null;
	const totalStock = variations.reduce(
		(sum, variation) =>
			sum + (Number.isFinite(variation.stock) ? variation.stock : 0),
		0,
	);
	const totalFeatures = variations.reduce(
		(sum, variation) => sum + (variation.features?.length ?? 0),
		0,
	);
	const colors = Array.from(
		new Set(variations.map((variation) => variation.color.trim()).filter(Boolean)),
	);

	const priceLabel =
		minPrice === null
			? "—"
			: maxPrice === null || minPrice === maxPrice
				? formatCurrency(minPrice)
				: `${formatCurrency(minPrice)} – ${formatCurrency(maxPrice)}`;

	return (
		<form action={formAction} className='flex flex-col gap-5'>
			{initial ? <input type='hidden' name='id' value={initial.id} /> : null}
			<input type='hidden' name='imageUrl' value={imageUrl} />

			<div className='grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_340px]'>
				<div className='flex flex-col gap-5'>
					<Card size='sm'>
						<CardHeader>
							<CardTitle>Product details</CardTitle>
							<CardDescription>
								The information customers see on the product page.
							</CardDescription>
						</CardHeader>
						<CardContent className='flex flex-col gap-4'>
							<div className='grid gap-3 sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]'>
								<div className='flex flex-col gap-1.5'>
									<Label htmlFor='name'>
										Product name <RequiredMark />
									</Label>
									<Input
										id='name'
										name='name'
										value={name}
										onChange={(event) => handleNameChange(event.target.value)}
										placeholder='e.g. iPhone 15 Pro'
										aria-invalid={Boolean(fieldErrors.name)}
									/>
									<FieldError message={fieldErrors.name?.[0]} />
								</div>

								<div className='flex flex-col gap-1.5'>
									<Label htmlFor='slug'>
										Slug <RequiredMark />
									</Label>
									<Input
										id='slug'
										name='slug'
										value={slug}
										onChange={(event) => {
											setSlug(event.target.value);
											setSlugTouched(true);
										}}
										placeholder='iphone-15-pro'
										aria-invalid={Boolean(fieldErrors.slug)}
									/>
									<FieldError message={fieldErrors.slug?.[0]} />
								</div>
							</div>

							<div className='flex flex-col gap-1.5'>
								<Label htmlFor='description'>
									Description <RequiredMark />
								</Label>
								<Textarea
									id='description'
									name='description'
									value={description}
									onChange={(event) => setDescription(event.target.value)}
									placeholder='Describe the product, materials, and what makes it stand out...'
									className='min-h-28'
									aria-invalid={Boolean(fieldErrors.description)}
								/>
								<FieldError message={fieldErrors.description?.[0]} />
							</div>
						</CardContent>
					</Card>

					<Card size='sm'>
						<CardHeader>
							<SectionTitle icon={Tag}>Catalogue</SectionTitle>
							<CardDescription>
								Place the product in a category and brand.
							</CardDescription>
						</CardHeader>
						<CardContent className='flex flex-col gap-4'>
							<div className='grid gap-3 sm:grid-cols-2'>
								<div className='flex flex-col gap-1.5'>
									<Label>
										Category <RequiredMark />
									</Label>
									<Select
										name='categoryId'
										value={categoryId}
										onValueChange={(value) =>
											setCategoryId((value as string | null) ?? null)
										}>
										<SelectTrigger className='w-full'>
											<SelectValue>
												{(value: string | null) =>
													value
														? (categories.find((item) => item.id === value)
																?.label ?? "None")
														: "Select a category"
												}
											</SelectValue>
										</SelectTrigger>
										<SelectContent>
											{categories.map((category) => (
												<SelectItem key={category.id} value={category.id}>
													{category.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FieldError message={fieldErrors.categoryId?.[0]} />
								</div>

								<div className='flex flex-col gap-1.5'>
									<Label>
										Brand <RequiredMark />
									</Label>
									<Select
										name='brandId'
										value={brandId}
										onValueChange={(value) =>
											setBrandId((value as string | null) ?? null)
										}>
										<SelectTrigger className='w-full'>
											<SelectValue>
												{(value: string | null) =>
													value
														? (brands.find((item) => item.id === value)?.label ??
															"None")
														: "Select a brand"
												}
											</SelectValue>
										</SelectTrigger>
										<SelectContent>
											{brands.map((brand) => (
												<SelectItem key={brand.id} value={brand.id}>
													{brand.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FieldError message={fieldErrors.brandId?.[0]} />
								</div>
							</div>

							<div className='flex items-center justify-between rounded-lg border border-border px-3 py-2'>
								<div className='flex items-center gap-2'>
									<span className='text-sm font-medium'>Active</span>
									<span className='text-xs text-muted-foreground'>
										Visible in the storefront
									</span>
								</div>
								<Switch
									name='isActive'
									checked={isActive}
									onCheckedChange={(checked) => setIsActive(checked)}
								/>
							</div>
						</CardContent>
					</Card>

					<Card size='sm'>
						<CardHeader>
							<SectionTitle icon={Layers}>Variations</SectionTitle>
							<CardDescription>
								Every purchasable color and size combination. At least one is
								required.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<ProductVariationsEditor
								variations={variations}
								onChange={setVariations}
							/>
							<FieldError message={fieldErrors.variations?.[0]} />
						</CardContent>
					</Card>
				</div>

				<aside className='flex flex-col gap-4 lg:sticky lg:top-20'>
					<Card size='sm'>
						<CardHeader>
							<SectionTitle icon={Eye}>Preview</SectionTitle>
							<CardDescription>
								A live look at how the product appears to customers.
							</CardDescription>
						</CardHeader>
						<CardContent className='flex flex-col gap-3'>
							<div className='flex flex-col gap-1.5'>
								<Label>Cover image</Label>
								<ImageUpload
									compact
									label='Upload main image'
									hint='Required'
									value={imageUrl || null}
									onChange={(value) => setImageUrl(value ?? "")}
								/>
								<FieldError message={fieldErrors.imageUrl?.[0]} />
							</div>

							<div className='flex flex-col gap-0.5'>
								<span className='text-sm font-semibold'>
									{name.trim() || "Untitled product"}
								</span>
								<span className='text-xs text-muted-foreground'>
									/{slug.trim() || "product-slug"}
								</span>
							</div>

							<div className='flex flex-wrap gap-1.5'>
								<Badge variant='secondary'>
									{categoryLabel ?? "No category"}
								</Badge>
								<Badge variant='outline'>{brandLabel ?? "No brand"}</Badge>
								<Badge variant={isActive ? "secondary" : "outline"}>
									{isActive ? "Active" : "Hidden"}
								</Badge>
							</div>

							<dl className='grid grid-cols-2 gap-2 rounded-lg bg-muted/50 p-2.5'>
								<div className='flex flex-col gap-0.5'>
									<dt className='text-[11px] text-muted-foreground'>Price</dt>
									<dd className='text-sm font-semibold'>{priceLabel}</dd>
								</div>
								<div className='flex flex-col gap-0.5'>
									<dt className='text-[11px] text-muted-foreground'>Stock</dt>
									<dd className='text-sm font-semibold'>{totalStock}</dd>
								</div>
								<div className='flex flex-col gap-0.5'>
									<dt className='text-[11px] text-muted-foreground'>
										Variations
									</dt>
									<dd className='text-sm font-semibold'>{variations.length}</dd>
								</div>
								<div className='flex flex-col gap-0.5'>
									<dt className='text-[11px] text-muted-foreground'>
										Features
									</dt>
									<dd className='text-sm font-semibold'>{totalFeatures}</dd>
								</div>
							</dl>

							{colors.length > 0 ? (
								<div className='flex flex-wrap items-center gap-1.5'>
									<span className='text-[11px] text-muted-foreground'>
										Colors
									</span>
									{colors.map((color) => (
										<span
											key={color}
											className='rounded-full border border-border px-2 py-0.5 text-[11px] font-medium'>
											{color}
										</span>
									))}
								</div>
							) : null}
						</CardContent>
					</Card>
				</aside>
			</div>

			<div className='sticky bottom-0 z-10 -mx-4 flex flex-wrap items-center justify-between gap-3 border-t border-border bg-background/95 px-4 py-3 backdrop-blur md:-mx-6 md:px-6'>
				<p className='text-xs text-muted-foreground'>
					Fields marked <span className='text-danger'>*</span> are required.
				</p>
				<div className='flex justify-end gap-2'>
					<Button type='button' variant='outline' onClick={onCancel}>
						Cancel
					</Button>
					<Button
						type='submit'
						disabled={pending}
						className={cn(pending && "opacity-70")}>
						{pending ? "Saving…" : initial ? "Save changes" : "Save product"}
					</Button>
				</div>
			</div>
		</form>
	);
}

type NewProductFormProps = {
	categories?: Option[];
	brands?: Option[];
};

export function NewProductForm(props: NewProductFormProps) {
	const router = useRouter();

	return (
		<ProductForm
			{...props}
			onCancel={() => router.push("/admin/products")}
		/>
	);
}

type EditProductFormProps = {
	product: ProductFormValues;
	categories?: Option[];
	brands?: Option[];
};

export function EditProductForm({ product, ...props }: EditProductFormProps) {
	const router = useRouter();

	return (
		<ProductForm
			key={product.id}
			initial={product}
			{...props}
			onCancel={() => router.push("/admin/products")}
		/>
	);
}
