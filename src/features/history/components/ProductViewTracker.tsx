"use client";

import { useEffect } from "react";
import { recordProductViewAction } from "../server/history.actions";

/**
 * Records a product view once the page has loaded in a real browser, so
 * crawlers and prefetches don't create guest sessions or inflate history.
 */
export function ProductViewTracker({ productId }: { productId: string }) {
	useEffect(() => {
		void recordProductViewAction(productId).catch(() => {});
	}, [productId]);

	return null;
}
