import { DollarSign, Package, ShoppingCart, Users } from "lucide-react";
import { formatCurrency } from "@/shared";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/shared/components/ui/card";
import { PageHeader, StatsCard } from "@/features/admin";
import { AdminHeader } from "@/features/admin/components/AdminHeader";
import { getProductCount } from "@/features/products/server/products.service";

export default async function AdminDashboardPage() {
	const productCount = await getProductCount();

	return (
		<>
			<AdminHeader title='Dashboard' />
			<div className='flex flex-1 flex-col gap-6 p-gutter pb-24'>
				<PageHeader description='Overview of your store performance.' />

				<div className='grid gap-3 sm:grid-cols-2 xl:grid-cols-4'>
					<StatsCard
						label='Total Revenue'
						value={formatCurrency(0)}
						icon={DollarSign}
					/>
					<StatsCard label='Orders' value='0' icon={ShoppingCart} />
					<StatsCard
						label='Products'
						value={String(productCount)}
						icon={Package}
					/>
					<StatsCard label='Customers' value='0' icon={Users} />
				</div>

				<Card>
					<CardHeader>
						<CardTitle>Recent Orders</CardTitle>
						<CardDescription>Latest orders in your store.</CardDescription>
					</CardHeader>
					<CardContent className='flex flex-col items-center gap-1 py-12 text-center'>
						<p className='text-sm font-medium'>No orders yet</p>
						<p className='text-sm text-muted-foreground'>
							Orders will appear here once they are recorded.
						</p>
					</CardContent>
				</Card>
			</div>
		</>
	);
}
