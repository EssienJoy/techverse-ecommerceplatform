"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Pencil } from "lucide-react";

import { DotsLoader, formatCurrency, useAlertStore } from "@/shared";
import type { Product } from "@/shared/lib";
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
import {
	DEFAULT_PRODUCT_PAGE_SIZE,
	type ProductCursor,
} from "@/features/products/lib/pagination";
import { fetchProductsPage } from "@/features/products/server/products.queries";
import { isLowStock } from "@/features/products/lib/stock";
import { DeleteProductButton } from "./DeleteProductButton";

function getStatus(stock: number) {
	if (stock <= 0) {
		return { label: "Out of stock", variant: "destructive" as const };
	}

	if (isLowStock(stock)) {
		return { label: "Low stock", variant: "outline" as const };
	}

	return { label: "In stock", variant: "secondary" as const };
}

type AdminProductsTableProps = {
	initialProducts: Product[];
	initialNextCursor: ProductCursor | null;
};

export function AdminProductsTable({
	initialProducts,
	initialNextCursor,
}: AdminProductsTableProps) {
	const [products, setProducts] = useState(initialProducts);
	const [nextCursor, setNextCursor] = useState(initialNextCursor);
	const [isLoadingMore, setIsLoadingMore] = useState(false);
	const showError = useAlertStore((state) => state.error);
	const sentinelRef = useRef<HTMLDivElement | null>(null);

	const loadMore = useCallback(() => {
		if (!nextCursor || isLoadingMore) return;

		setIsLoadingMore(true);

		fetchProductsPage({
			limit: DEFAULT_PRODUCT_PAGE_SIZE,
			cursor: nextCursor,
			includeInactive: true,
		})
			.then((page) => {
				setProducts((current) => {
					const seen = new Set(current.map((product) => product.id));
					return [
						...current,
						...page.products.filter((product) => !seen.has(product.id)),
					];
				});
				setNextCursor(page.nextCursor);
			})
			.catch(() => {
				showError("Could not load more products.");
			})
			.finally(() => setIsLoadingMore(false));
	}, [nextCursor, isLoadingMore, showError]);

	useEffect(() => {
		const node = sentinelRef.current;
		if (!node || !nextCursor) return;

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries.some((entry) => entry.isIntersecting)) {
					loadMore();
				}
			},
			{ rootMargin: "400px 0px" },
		);

		observer.observe(node);
		return () => observer.disconnect();
	}, [nextCursor, loadMore]);

	return (
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

				<div
					ref={sentinelRef}
					className='flex min-h-12 items-center justify-center'>
					{isLoadingMore ? (
						<DotsLoader />
					) : nextCursor ? (
						<span className='sr-only'>More products load automatically</span>
					) : (
						<span className='text-xs text-muted-foreground'>
							You&apos;ve reached the end
						</span>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
