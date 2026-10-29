import { Header } from "@/features/navigation";
import { Container, SearchInput } from "@/shared";
import type { ReactNode } from "react";

export default function ShopLayout({ children }: { children: ReactNode }) {
	return (
		<>
			<Header text='Shop' showBack={false} showSaved />
			<section className='pb-12'>
				<Container>
					<SearchInput />
				</Container>
				{children}
			</section>
		</>
	);
}
