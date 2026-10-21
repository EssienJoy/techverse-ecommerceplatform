import { Card, CardContent } from "@/shared/components/ui/card";
import { PageHeader } from "@/features/admin";
import { AdminHeader } from "@/features/admin/components/AdminHeader";

export default function AdminOrdersPage() {
	return (
		<>
			<AdminHeader title='Orders' />
			<div className='flex flex-1 flex-col gap-6 p-4 pb-24 md:p-6'>
				<PageHeader description='Track and fulfil customer orders.' />

				<Card>
					<CardContent className='flex flex-col items-center gap-1 py-16 text-center'>
						<p className='text-sm font-medium'>No orders yet</p>
						<p className='text-sm text-muted-foreground'>
							Orders will appear here once customers check out.
						</p>
					</CardContent>
				</Card>
			</div>
		</>
	);
}
