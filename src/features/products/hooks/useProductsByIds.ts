"use client";

import { useEffect, useReducer } from "react";
import type { Product } from "@/shared/lib";
import { fetchProductsByIds } from "../server/products.queries";

const cache = new Map<string, Product>();

export function useProductsByIds(ids: string[]) {
	const uniqueKey = Array.from(new Set(ids.filter(Boolean))).sort().join("|");
	const [, refresh] = useReducer((count: number) => count + 1, 0);

	useEffect(() => {
		if (!uniqueKey) return;

		const missing = uniqueKey.split("|").filter((id) => !cache.has(id));

		if (missing.length === 0) return;

		let active = true;

		fetchProductsByIds(missing)
			.then((products) => {
				products.forEach((product) => cache.set(product.id, product));
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
	let isLoading = false;

	if (uniqueKey) {
		for (const id of uniqueKey.split("|")) {
			const product = cache.get(id);

			if (product) productsById.set(id, product);
			else isLoading = true;
		}
	}

	return { productsById, isLoading };
}
