import Link from "next/link";
import { Suspense } from "react";
import { Package, Plus } from "lucide-react";

import { EmptyState, Skeleton } from "@/shared";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { getProducts } from "@/features/products/server/products.service";
import { DEFAULT_PRODUCT_PAGE_SIZE } from "@/features/products/lib/pagination";
import {
	AdminProductsTable,
	PageHeader,
	ProductSuccessAlert,
} from "@/features/admin";
import { AdminHeader } from "@/features/admin/components/AdminHeader";

function ProductsTableSkeleton() {
	return (
		<Card>
			<CardContent className='flex flex-col gap-3'>
				{Array.from({ length: 6 }).map((_, index) => (
					<Skeleton key={index} className='h-12 w-full rounded-lg' />
				))}
			</CardContent>
		</Card>
	);
}

async function ProductsTable({
	searchParams,
}: {
	searchParams: Promise<{ created?: string; updated?: string }>;
}) {
	const [{ created, updated }, page] = await Promise.all([
		searchParams,
		getProducts({
			limit: DEFAULT_PRODUCT_PAGE_SIZE,
			includeInactive: true,
		}),
	]);

	return (
		<>
			<ProductSuccessAlert
				kind={created ? "created" : updated ? "updated" : null}
			/>

			{page.total === 0 ? (
				<EmptyState
					icon={Package}
					title='No products yet'
					description='Add your first product to start building your catalogue.'
					actionLabel='Add product'
					actionHref='/admin/products/new'
				/>
			) : (
				<AdminProductsTable
					key={`${page.products.map((product) => product.id).join(":")}:${page.nextCursor?.id ?? "end"}`}
					initialProducts={page.products}
					initialNextCursor={page.nextCursor}
				/>
			)}
		</>
	);
}

export default function AdminProductsPage({
	searchParams,
}: {
	searchParams: Promise<{ created?: string; updated?: string }>;
}) {
	return (
		<>
			<AdminHeader title='Products' />
			<div className='flex flex-1 flex-col gap-6 p-gutter pb-24'>
				<PageHeader description='Manage your catalogue, stock and pricing.'>
					<Button
						nativeButton={false}
						render={<Link href='/admin/products/new' />}>
						<Plus />
						Add product
					</Button>
				</PageHeader>

				<Suspense fallback={<ProductsTableSkeleton />}>
					<ProductsTable searchParams={searchParams} />
				</Suspense>
			</div>
		</>
	);
}
