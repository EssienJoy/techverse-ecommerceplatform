import { Button, Input } from "@/shared";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Label } from "@/shared/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/shared/components/ui/select";
import { Textarea } from "@/shared/components/ui/textarea";
import { ImageUpload, PageHeader } from "../../components";

const categories = [
	"Phones",
	"Laptops",
	"Powerbanks",
	"Charger",
	"Cords",
	"Ear piece",
	"Headsets",
	"Tabs",
	"Computer",
	"Ear pods",
];

export default function NewProductPage() {
	return (
		<div className='flex flex-col gap-6'>
			<PageHeader
				title='Add product'
				description='Create a new product for your store.'
			/>

			<Card>
				<CardContent>
					<form className='flex flex-col gap-6'>
						<div className='grid gap-6 lg:grid-cols-[280px_1fr]'>
							<div className='flex flex-col gap-2'>
								<Label>Product image</Label>
								<ImageUpload label='Upload product image' />
								<ImageUpload label='Add another image' />
							</div>

							<div className='flex flex-col gap-4'>
								<div className='flex flex-col gap-2'>
									<Label htmlFor='name'>Product name</Label>
									<Input
										id='name'
										name='name'
										placeholder='e.g. iPhone 15 Pro'
									/>
								</div>
								<div className='grid gap-4 sm:grid-cols-2'>
									<div className='flex flex-col gap-2'>
										<Label htmlFor='price'>Price</Label>
										<Input
											id='price'
											name='price'
											type='number'
											placeholder='0.00'
										/>
									</div>
									<div className='flex flex-col gap-2'>
										<Label htmlFor='stock'>Stock</Label>
										<Input
											id='stock'
											name='stock'
											type='number'
											placeholder='0'
										/>
									</div>
								</div>
								<div className='flex flex-col gap-2'>
									<Label htmlFor='category'>Category</Label>
									<Select defaultValue='Phones'>
										<SelectTrigger id='category' className='w-full'>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{categories.map((category) => (
												<SelectItem key={category} value={category}>
													{category}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
								<div className='flex flex-col gap-2'>
									<Label htmlFor='description'>Description</Label>
									<Textarea
										id='description'
										name='description'
										placeholder='Describe the product...'
									/>
								</div>
							</div>
						</div>

						<div className='flex justify-end gap-2'>
							<Button type='button' variant='outline'>
								Cancel
							</Button>
							<Button type='submit'>Save product</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
