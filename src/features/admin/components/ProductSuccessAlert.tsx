"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAlertStore } from "@/shared";

type ProductSuccessAlertProps = {
	kind: "created" | "updated" | null;
};

export function ProductSuccessAlert({ kind }: ProductSuccessAlertProps) {
	const router = useRouter();
	const pathname = usePathname();
	const showSuccess = useAlertStore((store) => store.success);

	useEffect(() => {
		if (!kind) return;

		showSuccess(
			kind === "created"
				? "Product created successfully."
				: "Product updated successfully.",
		);
		router.replace(pathname, { scroll: false });
	}, [kind, pathname, router, showSuccess]);

	return null;
}
