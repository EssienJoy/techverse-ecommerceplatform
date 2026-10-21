import { Card, CardContent } from "@/shared/components/ui/card";
import { PageHeader } from "@/features/admin";
import { AdminHeader } from "@/features/admin/components/AdminHeader";

export default function AdminAnalyticsPage() {
	return (
		<>
			<AdminHeader title='Analytics' />
			<div className='flex flex-1 flex-col gap-6 p-4 pb-24 md:p-6'>
				<PageHeader description='Track revenue, profit, orders and product performance.' />

				<Card>
					<CardContent className='flex flex-col items-center gap-1 py-16 text-center'>
						<p className='text-sm font-medium'>No analytics data yet</p>
						<p className='text-sm text-muted-foreground'>
							Revenue, orders and product insights will appear once orders are
							recorded.
						</p>
					</CardContent>
				</Card>
			</div>
		</>
	);
}
