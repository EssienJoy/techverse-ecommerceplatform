import { Card, CardContent } from "@/shared/components/ui/card";
import { PageHeader } from "@/features/admin";
import { AdminHeader } from "@/features/admin/components/AdminHeader";

export default function AdminCustomersPage() {
	return (
		<>
			<AdminHeader title='Customers' />
			<div className='flex flex-1 flex-col gap-6 p-4 pb-24 md:p-6'>
				<PageHeader description='People shopping in your store.' />

				<Card>
					<CardContent className='flex flex-col items-center gap-1 py-16 text-center'>
						<p className='text-sm font-medium'>No customers yet</p>
						<p className='text-sm text-muted-foreground'>
							Customer accounts and activity will appear here.
						</p>
					</CardContent>
				</Card>
			</div>
		</>
	);
}
