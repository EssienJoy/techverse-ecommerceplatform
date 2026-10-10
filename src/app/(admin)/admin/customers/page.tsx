import { formatCurrency } from "@/shared";
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

const customers = [
	{ id: "c1", name: "Ada Obi", email: "ada@example.com", orders: 12, spent: 8450, joined: "Jan 2026" },
	{ id: "c2", name: "John Doe", email: "john@example.com", orders: 5, spent: 1290, joined: "Mar 2026" },
	{ id: "c3", name: "Mary Bello", email: "mary@example.com", orders: 9, spent: 4310, joined: "Feb 2026" },
	{ id: "c4", name: "Sam Nwosu", email: "sam@example.com", orders: 2, spent: 320, joined: "Jun 2026" },
	{ id: "c5", name: "Chidi Eze", email: "chidi@example.com", orders: 7, spent: 2140, joined: "Apr 2026" },
];

export default function AdminCustomersPage() {
	return (
		<div className='flex flex-col gap-6'>
			<PageHeader
				title='Customers'
				description='People shopping in your store.'
			/>

			<Card>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Name</TableHead>
								<TableHead>Email</TableHead>
								<TableHead>Orders</TableHead>
								<TableHead>Total spent</TableHead>
								<TableHead>Joined</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{customers.map((customer) => (
								<TableRow key={customer.id}>
									<TableCell className='font-medium'>{customer.name}</TableCell>
									<TableCell>{customer.email}</TableCell>
									<TableCell>{customer.orders}</TableCell>
									<TableCell>{formatCurrency(customer.spent)}</TableCell>
									<TableCell>{customer.joined}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</div>
	);
}
