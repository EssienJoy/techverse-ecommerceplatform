"use client";

import { ArrowLeft, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button, Container } from "@/shared";

type HeaderProps = {
	text: string;
	isCart?: boolean;
	number?: string;
};

export function Header({ text, isCart = true, number }: HeaderProps) {
	const router = useRouter();

	return (
		<header>
			<Container className='flex items-center justify-between py-4'>
				<Button
					variant='ghost'
					size='icon'
					aria-label='Go back'
					onClick={() => router.back()}>
					<ArrowLeft />
				</Button>
				<h1 className='text-xl font-bold tracking-tight mx-auto'>
					{text} {number && `(${number})`}
				</h1>
				{isCart && (
					<Button variant='ghost' size='icon' aria-label='Cart'>
						<ShoppingCart />
					</Button>
				)}

				{!isCart && <Button variant='ghost'>Clear All</Button>}
			</Container>
		</header>
	);
}
