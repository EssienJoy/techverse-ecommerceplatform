import { Search as SearchIcon } from "lucide-react";
import { Container } from "@/shared";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from "@/shared/components/ui/input-group";

export function SearchBar() {
	return (
		<Container className='px-4'>
			<form role='search'>
				<InputGroup className='h-8 rounded-2xl bg-white'>
					<InputGroupInput
						type='search'
						name='q'
						placeholder='Search products...'
						aria-label='Search products'
						className='pl-3 text-sm'
					/>
					<InputGroupAddon align='inline-end'>
						<InputGroupButton type='submit' aria-label='Search products'>
							<SearchIcon />
						</InputGroupButton>
					</InputGroupAddon>
				</InputGroup>
			</form>
		</Container>
	);
}
