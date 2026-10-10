import { Download, ShoppingCart } from "lucide-react";
import { Button, Container, siteConfig } from "@/shared";
import Link from "next/link";

export function Header() {
	return (
		<header>
			<Container className='flex items-center justify-between py-4'>
				<Link
					href='/'
					className='text-xl
      text-foreground-primary font-bold tracking-tight'>
					{siteConfig.name}
				</Link>
				<div className='flex items-center gap-1'>
					<Button variant='ghost' size='icon' aria-label='Download'>
						<Download />
					</Button>
					<Button variant='ghost' size='icon' aria-label='Cart'>
						<ShoppingCart />
					</Button>
				</div>
			</Container>
		</header>
	);
}
