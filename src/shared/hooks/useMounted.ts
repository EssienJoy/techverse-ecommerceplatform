"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * `false` during server rendering and the first hydration pass, then `true`.
 *
 * Persisted client state (cart, addresses, cards) only exists in the browser,
 * so components can use this to show a stable loading state instead of the
 * server-rendered defaults.
 */
export function useMounted() {
	return useSyncExternalStore(
		subscribe,
		() => true,
		() => false,
	);
}
