import {
	Brands,
	Categories,
	Deals,
	Hero,
	LimitedStock,
	ProductSections,
	RecentlyViewed,
	SearchBar,
} from "./components";

export default function Home() {
	return (
		<>
			<SearchBar />
			<Hero />
			<Categories />
			<Deals />
			<Brands />
			<LimitedStock />
			<RecentlyViewed />
			<ProductSections />
		</>
	);
}
