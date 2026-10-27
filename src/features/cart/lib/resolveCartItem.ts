import type { CartItem, CartLine } from "../schema";
import type { Product } from "@/features/products/schema";

// Maps a stored cart line to a display item, resolving the variation so price,
// image, colour and size reflect the exact variation that was added.
export function resolveCartItem(line: CartLine, product: Product): CartItem {
	const variation = line.variationId
		? product.variations.find((item) => item.id === line.variationId)
		: undefined;

	return {
		productId: product.id,
		variationId: variation?.id,
		name: product.name,
		price: variation?.price ?? product.price,
		imageUrl: variation?.images[0] ?? product.imageUrl,
		color: variation?.color,
		size: variation?.size,
		quantity: line.qty,
	};
}
