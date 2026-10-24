import Link from "next/link";

export function CatalogBreadcrumb() {
	return (
		<nav
			aria-label='Breadcrumb'
			className='mb-3 flex items-center gap-2 text-xs font-medium text-white/60'>
			<Link href='/' className='transition-colors hover:text-white'>
				Home
			</Link>
			<span aria-hidden='true'>|</span>
			<Link href='/shop' className='transition-colors hover:text-white'>
				Shop
			</Link>
		</nav>
	);
}
