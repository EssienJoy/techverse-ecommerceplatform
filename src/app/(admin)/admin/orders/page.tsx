import { formatCurrency } from "@/shared";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent } from "@/shared/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/shared/components/ui/table";
import { PageHeader } from "../components";

const orders = [
	{ id: "#1024", customer: "Ada Obi", date: "Oct 8, 2026", items: 2, total: 1199, status: "Delivered" },
	{ id: "#1023", customer: "John Doe", date: "Oct 8, 2026", items: 1, total: 299, status: "Pending" },
	{ id: "#1022", customer: "Mary Bello", date: "Oct 7, 2026", items: 3, total: 950, status: "Shipped" },
	{ id: "#1021", customer: "Sam Nwosu", date: "Oct 7, 2026", items: 1, total: 45, status: "Delivered" },
	{ id: "#1020", customer: "Chidi Eze", date: "Oct 6, 2026", items: 2, total: 349, status: "Cancelled" },
	{ id: "#1019", customer: "Grace Ade", date: "Oct 6, 2026", items: 4, total: 2140, status: "Delivered" },
];

function getVariant(status: string) {
	if (status === "Delivered") {
		return "secondary" as const;
	}

	if (status === "Cancelled") {
		return "destructive" as const;
	}

	return "outline" as const;
}

export default function AdminOrdersPage() {
	return (
		<div className='flex flex-col gap-6'>
			<PageHeader
				title='Orders'
				description='Track and fulfil customer orders.'
			/>

			<Card>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Order</TableHead>
								<TableHead>Customer</TableHead>
								<TableHead>Date</TableHead>
								<TableHead>Items</TableHead>
								<TableHead>Total</TableHead>
								<TableHead>Status</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{orders.map((order) => (
								<TableRow key={order.id}>
									<TableCell className='font-medium'>{order.id}</TableCell>
									<TableCell>{order.customer}</TableCell>
									<TableCell>{order.date}</TableCell>
									<TableCell>{order.items}</TableCell>
									<TableCell>{formatCurrency(order.total)}</TableCell>
									<TableCell>
										<Badge variant={getVariant(order.status)}>
											{order.status}
										</Badge>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</div>
	);
}
