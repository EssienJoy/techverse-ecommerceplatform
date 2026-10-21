"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/shared";
import { deleteProductAction } from "@/features/products/server/products.actions";

export function DeleteProductButton({
	id,
	name,
}: {
	id: string;
	name: string;
}) {
	const [isPending, startTransition] = useTransition();

	const handleDelete = () => {
		if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;

		startTransition(async () => {
			await deleteProductAction(id);
		});
	};

	return (
		<Button
			variant='ghost'
			size='icon-sm'
			aria-label='Delete product'
			disabled={isPending}
			onClick={handleDelete}>
			<Trash2 />
		</Button>
	);
}
