"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { DotsLoader, useAlertStore } from "@/shared";
import { ProductCard } from "@/features/products";
import type { Product } from "@/features/products/schema";
import {
	DEFAULT_PRODUCT_PAGE_SIZE,
	type ProductCursor,
	type ProductPageOptions,
} from "@/features/products/lib/pagination";
import { fetchProductsPage } from "@/features/products/server/products.queries";

type ProductFeedProps = {
	initialProducts: Product[];
	initialNextCursor: ProductCursor | null;
	initialTotal: number;
	filters: Pick<
		ProductPageOptions,
		"categoryId" | "brandId" | "inStockOnly" | "sort"
	>;
};

export function ProductFeed({
	initialProducts,
	initialNextCursor,
	initialTotal,
	filters,
}: ProductFeedProps) {
	const [products, setProducts] = useState(initialProducts);
	const [nextCursor, setNextCursor] = useState(initialNextCursor);
	const [total] = useState(initialTotal);
	const [isLoadingMore, setIsLoadingMore] = useState(false);

	const showError = useAlertStore((state) => state.error);
	const sentinelRef = useRef<HTMLDivElement | null>(null);

	const loadMore = useCallback(() => {
		if (!nextCursor || isLoadingMore) return;

		setIsLoadingMore(true);

		fetchProductsPage({
			limit: DEFAULT_PRODUCT_PAGE_SIZE,
			cursor: nextCursor,
			...filters,
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
			.finally(() => {
				setIsLoadingMore(false);
			});
	}, [nextCursor, isLoadingMore, filters, showError]);

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
		<>
			<section className='flex items-center justify-between'>
				<h2 className='text-lg font-bold text-foreground'>Products</h2>
				<p className='text-xs text-muted-foreground'>
					Showing {products.length} of {total}
				</p>
			</section>

			<section className='my-6 grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-4'>
				{products.map((product) => (
					<ProductCard key={product.id} product={product} />
				))}
			</section>

			<div
				ref={sentinelRef}
				className='flex min-h-14 items-center justify-center'>
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
		</>
	);
}
