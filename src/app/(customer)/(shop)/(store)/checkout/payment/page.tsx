import { redirect } from "next/navigation";
import { getCurrentUser } from "@/features/auth/server/user.service";

export const instant = false;

/**
 * Payment now happens on Stripe's hosted page, opened straight from the
 * shipping form. This route stays only so old links land back at checkout.
 */
export default async function PaymentPage() {
	const user = await getCurrentUser();
	if (!user) redirect("/login?next=%2Fcheckout");
	if (user.role !== "user") redirect("/");

	redirect("/checkout");
}
