import type { Order } from "../schema";

export function formatOrderDate(iso: string) {
	const date = new Date(iso);
	if (Number.isNaN(date.getTime())) return iso;

	return new Intl.DateTimeFormat("en-GB", {
		day: "numeric",
		month: "short",
		year: "numeric",
	}).format(date);
}

/** Stripe session ids are long; the last characters are enough to recognise one. */
export function shortOrderId(id: string) {
	return id.length > 12 ? id.slice(-8).toUpperCase() : id.toUpperCase();
}

export function countOrderItems(order: Order) {
	return order.items.reduce((sum, item) => sum + item.qty, 0);
}
