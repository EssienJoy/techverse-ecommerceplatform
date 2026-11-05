"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

type ProductSuccessAlertProps = {
	kind: "created" | "updated" | null;
};

export function ProductSuccessAlert({ kind }: ProductSuccessAlertProps) {
	const router = useRouter();
	const pathname = usePathname();

	useEffect(() => {
		if (!kind) return;

		toast.success(
			kind === "created"
				? "Product created successfully."
				: "Product updated successfully.",
		);
		router.replace(pathname, { scroll: false });
	}, [kind, pathname, router]);

	return null;
}
