import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { Package, Pencil, Plus } from "lucide-react";

import { EmptyState, Skeleton, formatCurrency } from "@/shared";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/shared/components/ui/table";
import { getProducts } from "@/features/products/server/products.service";
import { isLowStock } from "@/features/products/lib/stock";
import { DeleteProductButton, PageHeader, ProductSuccessAlert } from "@/features/admin";
import { AdminHeader } from "@/features/admin/components/AdminHeader";

function getStatus(stock: number) {
	if (stock <= 0) {
		return { label: "Out of stock", variant: "destructive" as const };
	}

	if (isLowStock(stock)) {
		return { label: "Low stock", variant: "outline" as const };
	}

	return { label: "In stock", variant: "secondary" as const };
}

function ProductsTableSkeleton() {
	return (
		<Card>
			<CardContent className='flex flex-col gap-3'>
				{Array.from({ length: 6 }).map((_, index) => (
					<Skeleton key={index} className='h-12 w-full rounded-lg' />
				))}
			</CardContent>
		</Card>
	);
}

async function ProductsTable({
	searchParams,
}: {
	searchParams: Promise<{ created?: string; updated?: string }>;
}) {
	const [{ created, updated }, products] = await Promise.all([
		searchParams,
		getProducts(),
	]);

	return (
		<>
			<ProductSuccessAlert
				kind={created ? "created" : updated ? "updated" : null}
			/>

			{products.length === 0 ? (
				<EmptyState
					icon={Package}
					title='No products yet'
					description='Add your first product to start building your catalogue.'
					actionLabel='Add product'
					actionHref='/admin/products/new'
				/>
			) : (
				<Card>
					<CardContent>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Product</TableHead>
									<TableHead>Price</TableHead>
									<TableHead>Stock</TableHead>
									<TableHead>Status</TableHead>
									<TableHead className='text-right'>Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{products.map((product) => {
									const status = getStatus(product.stock);

									return (
										<TableRow key={product.id}>
											<TableCell>
												<div className='flex items-center gap-3'>
													{product.imageUrl ? (
														<span className='relative size-9 shrink-0 overflow-hidden rounded-lg bg-white'>
															<Image
																src={product.imageUrl}
																alt={product.name}
																width={72}
																height={72}
																className='size-full object-contain'
															/>
														</span>
													) : (
														<span className='flex size-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand-100 to-brand-300 text-xs font-bold text-brand-700'>
															{product.name.charAt(0)}
														</span>
													)}
													<span className='font-medium'>{product.name}</span>
												</div>
											</TableCell>
											<TableCell>{formatCurrency(product.price)}</TableCell>
											<TableCell>{product.stock}</TableCell>
											<TableCell>
												<Badge variant={status.variant}>{status.label}</Badge>
											</TableCell>
											<TableCell className='text-right'>
												<div className='flex justify-end gap-1'>
													<Button
														variant='ghost'
														size='icon-sm'
														aria-label='Edit product'
														nativeButton={false}
														render={
															<Link
																href={`/admin/products/${product.id}/edit`}
															/>
														}>
														<Pencil />
													</Button>
													<DeleteProductButton
														id={product.id}
														name={product.name}
													/>
												</div>
											</TableCell>
										</TableRow>
									);
								})}
							</TableBody>
						</Table>
					</CardContent>
				</Card>
			)}
		</>
	);
}

export default function AdminProductsPage({
	searchParams,
}: {
	searchParams: Promise<{ created?: string; updated?: string }>;
}) {
	return (
		<>
			<AdminHeader title='Products' />
			<div className='flex flex-1 flex-col gap-6 p-4 pb-24 md:p-6'>
				<PageHeader description='Manage your catalogue, stock and pricing.'>
					<Button
						nativeButton={false}
						render={<Link href='/admin/products/new' />}>
						<Plus />
						Add product
					</Button>
				</PageHeader>

				<Suspense fallback={<ProductsTableSkeleton />}>
					<ProductsTable searchParams={searchParams} />
				</Suspense>
			</div>
		</>
	);
}
