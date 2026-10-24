"use client";

import { useEffect, useReducer } from "react";
import type { Product } from "@/shared/lib";
import { fetchProductsByIds } from "../server/products.queries";

const cache = new Map<string, Product>();
const unavailable = new Set<string>();

export function seedProductsByIds(products: Product[]) {
	products.forEach((product) => {
		cache.set(product.id, product);
		unavailable.delete(product.id);
	});
}

export function useProductsByIds(ids: string[]) {
	const uniqueKey = Array.from(new Set(ids.filter(Boolean))).sort().join("|");
	const [, refresh] = useReducer((count: number) => count + 1, 0);

	useEffect(() => {
		if (!uniqueKey) return;

		const pending = uniqueKey
			.split("|")
			.filter((id) => !cache.has(id) && !unavailable.has(id));

		if (pending.length === 0) return;

		let active = true;

		fetchProductsByIds(pending)
			.then((products) => {
				products.forEach((product) => cache.set(product.id, product));

				const found = new Set(products.map((product) => product.id));

				pending.forEach((id) => {
					if (!found.has(id)) unavailable.add(id);
				});
			})
			.catch(() => undefined)
			.finally(() => {
				if (active) refresh();
			});

		return () => {
			active = false;
		};
	}, [uniqueKey]);

	const productsById = new Map<string, Product>();
	const missingIds: string[] = [];
	let isLoading = false;

	if (uniqueKey) {
		for (const id of uniqueKey.split("|")) {
			const product = cache.get(id);

			if (product) productsById.set(id, product);
			else if (unavailable.has(id)) missingIds.push(id);
			else isLoading = true;
		}
	}

	return { productsById, isLoading, missingIds };
}
