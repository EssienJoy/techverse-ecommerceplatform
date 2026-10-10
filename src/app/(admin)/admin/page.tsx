import { DollarSign, Package, ShoppingCart, Users } from "lucide-react";
import { products } from "@/features/products";
import { formatCurrency } from "@/shared";
import { Badge } from "@/shared/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/shared/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/shared/components/ui/table";
import { PageHeader, StatsCard } from "./components";

const recentOrders = [
	{ id: "#1024", customer: "Ada Obi", total: 1199, status: "Delivered" },
	{ id: "#1023", customer: "John Doe", total: 299, status: "Pending" },
	{ id: "#1022", customer: "Mary Bello", total: 950, status: "Shipped" },
	{ id: "#1021", customer: "Sam Nwosu", total: 45, status: "Delivered" },
	{ id: "#1020", customer: "Chidi Eze", total: 349, status: "Cancelled" },
];

const lowStock = products.filter((product) => product.stock <= 10);

export default function AdminDashboardPage() {
	return (
		<div className='flex flex-col gap-6'>
			<PageHeader
				title='Dashboard'
				description='Overview of your store performance.'
			/>

			<div className='grid gap-3 sm:grid-cols-2 xl:grid-cols-4'>
				<StatsCard
					label='Total Revenue'
					value={formatCurrency(4250000)}
					icon={DollarSign}
				/>
				<StatsCard label='Orders' value='1,284' icon={ShoppingCart} />
				<StatsCard label='Products' value='96' icon={Package} />
				<StatsCard label='Customers' value='512' icon={Users} />
			</div>

			<div className='grid gap-4 xl:grid-cols-2'>
				<Card>
					<CardHeader>
						<CardTitle>Recent Orders</CardTitle>
						<CardDescription>Latest 5 orders in your store.</CardDescription>
					</CardHeader>
					<CardContent>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Order</TableHead>
									<TableHead>Customer</TableHead>
									<TableHead>Total</TableHead>
									<TableHead>Status</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{recentOrders.map((order) => (
									<TableRow key={order.id}>
										<TableCell className='font-medium'>{order.id}</TableCell>
										<TableCell>{order.customer}</TableCell>
										<TableCell>{formatCurrency(order.total)}</TableCell>
										<TableCell>
											<Badge
												variant={
													order.status === "Delivered"
														? "secondary"
														: order.status === "Cancelled"
															? "destructive"
															: "outline"
												}
											>
												{order.status}
											</Badge>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Low Stock</CardTitle>
						<CardDescription>Products running low on inventory.</CardDescription>
					</CardHeader>
					<CardContent className='flex flex-col gap-3'>
						{lowStock.map((product) => (
							<div
								key={product.id}
								className='flex items-center justify-between gap-3'
							>
								<div className='flex items-center gap-3'>
									<span className='flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-100 to-brand-300 text-brand-700'>
										<Package className='size-4' />
									</span>
									<span className='text-sm font-medium'>{product.name}</span>
								</div>
								<Badge variant={product.stock === 0 ? "destructive" : "outline"}>
									{product.stock} left
								</Badge>
							</div>
						))}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
