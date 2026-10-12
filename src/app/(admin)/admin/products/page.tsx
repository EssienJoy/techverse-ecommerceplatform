import { Pencil, Plus, Trash2 } from "lucide-react";
import { products } from "@/app/(customer)/(store)/product";
import { formatCurrency, Link } from "@/shared";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
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

function getStatus(stock: number) {
	if (stock === 0) {
		return { label: "Out of stock", variant: "destructive" as const };
	}

	if (stock <= 10) {
		return { label: "Low stock", variant: "outline" as const };
	}

	return { label: "In stock", variant: "secondary" as const };
}

export default function AdminProductsPage() {
	return (
		<div className='flex flex-col gap-6'>
			<PageHeader
				title='Products'
				description='Manage your catalogue, stock and pricing.'>
				<Button render={<Link href='/admin/products/new' />}>
					<Plus />
					Add product
				</Button>
			</PageHeader>

			<Card>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Product</TableHead>
								<TableHead>Price</TableHead>
								<TableHead>Stock</TableHead>
								<TableHead>Status</TableHead>
								<TableHead className='text-right'>Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{products.map((product) => {
								const status = getStatus(product.stock);

								return (
									<TableRow key={product.id}>
										<TableCell>
											<div className='flex items-center gap-3'>
												<span className='flex size-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand-100 to-brand-300 text-xs font-bold text-brand-700'>
													{product.name.charAt(0)}
												</span>
												<span className='font-medium'>{product.name}</span>
											</div>
										</TableCell>
										<TableCell>{formatCurrency(product.price)}</TableCell>
										<TableCell>{product.stock}</TableCell>
										<TableCell>
											<Badge variant={status.variant}>{status.label}</Badge>
										</TableCell>
										<TableCell className='text-right'>
											<div className='flex justify-end gap-1'>
												<Button
													variant='ghost'
													size='icon-sm'
													aria-label='Edit product'>
													<Pencil />
												</Button>
												<Button
													variant='ghost'
													size='icon-sm'
													aria-label='Delete product'>
													<Trash2 />
												</Button>
											</div>
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</div>
	);
}
