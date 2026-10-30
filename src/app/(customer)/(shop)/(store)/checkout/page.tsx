import { redirect } from "next/navigation";
import { Check } from "lucide-react";
import { cn } from "cn";
import { Container } from "@/shared";
import { Header } from "@/features/navigation";
import { getCurrentUser } from "@/features/auth/server/user.service";
import { CheckoutForm } from "@/features/checkout/components/CheckoutForm";
import { CheckoutSummary } from "@/features/checkout/components/CheckoutSummary";

// Reading the session cookie is uncached data, so this route must block rather
// than prerender.
export const instant = false;

const steps = [
	{ label: "Cart", state: "done" },
	{ label: "Details", state: "current" },
	{ label: "Payment", state: "upcoming" },
] as const;

function CheckoutProgress() {
	return (
		<ol className='mt-4 flex items-center' aria-label='Checkout progress'>
			{steps.map((step, index) => (
				<li
					key={step.label}
					aria-current={step.state === "current" ? "step" : undefined}
					className='flex flex-1 items-center gap-2 last:flex-none'>
					<span
						className={cn(
							"flex size-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
							step.state === "done" && "bg-success text-white",
							step.state === "current" &&
								"bg-primary text-foreground-inverse",
							step.state === "upcoming" &&
								"bg-muted text-muted-foreground",
						)}>
						{step.state === "done" ? (
							<Check className='size-3.5' aria-hidden />
						) : (
							index + 1
						)}
					</span>
					<span
						className={cn(
							"text-xs font-medium",
							step.state === "upcoming"
								? "text-muted-foreground"
								: "text-foreground",
						)}>
						{step.label}
					</span>
					{index < steps.length - 1 && (
						<span className='ml-1 h-px flex-1 bg-border' aria-hidden />
					)}
				</li>
			))}
		</ol>
	);
}

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
					<CheckoutProgress />
					<CheckoutSummary />
					<CheckoutForm defaultName={user.name ?? undefined} defaultEmail={user.email} />
				</Container>
			</section>
		</>
	);
}
