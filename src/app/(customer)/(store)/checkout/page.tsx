import { redirect } from "next/navigation";
import { Container } from "@/shared";
import { Header } from "@/features/navigation";
import { getCurrentUser } from "@/features/auth/server/user.service";
import { CheckoutForm } from "@/features/checkout/components/CheckoutForm";
import { CheckoutSummary } from "@/features/checkout/components/CheckoutSummary";

// Reading the session cookie is uncached data, so this route must block rather
// than prerender.
export const instant = false;

export default async function CheckoutPage() {
	// The proxy catches visitors with no session; this also rejects stale
	// cookies and admin accounts, which only the database can confirm.
	const user = await getCurrentUser();
	if (!user) redirect("/login?next=%2Fcheckout");
	if (user.role !== "user") redirect("/");

	return (
		<>
			<Header text='Checkout' />
			<section className='my-4'>
				<Container>
					<section className='mt-4'>
						<h2 className='text-xl font-bold tracking-tight text-foreground'>
							Shipping Address
						</h2>
						<CheckoutForm />
					</section>

					<CheckoutSummary />
				</Container>
			</section>
		</>
	);
}
