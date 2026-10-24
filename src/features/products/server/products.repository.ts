import "server-only";
import { prisma } from "@/prisma-client/prisma";
import { Prisma } from "@/generated/prisma/client";
import type { ProductInput, ProductUpdateInput } from "@/shared/lib";
import {
	isProductSort,
	normalizeProductPageSize,
	type ProductCursor,
	type ProductListFilters,
	type ProductPageOptions,
	type ProductSort,
} from "../lib/pagination";

export const productInclude = {
	category: true,
	brand: true,
	variations: {
		orderBy: { sku: "asc" },
		include: { images: true },
	},
	ratings: { select: { value: true } },
	_count: { select: { reviews: true } },
} as const;

export type ProductRecord = Prisma.ProductGetPayload<{
	include: typeof productInclude;
}>;

type ProductPageRow = {
	id: string;
	price: number;
	rating: number;
	ratingCount: number;
	createdAt: Date;
};

function toVariationCreate(variations: ProductInput["variations"]) {
	return variations.map((variation) => ({
		sku: variation.sku,
		color: variation.color,
		size: variation.size,
		price: variation.price,
		stock: variation.stock,
		features: variation.features,
		images: { create: variation.images.map((url) => ({ url })) },
	}));
}

function buildProductWhere({
	categoryId,
	brandId,
	inStockOnly,
	includeInactive,
}: ProductListFilters): Prisma.ProductWhereInput {
	return {
		...(includeInactive ? {} : { isActive: true }),
		...(categoryId ? { categoryId } : {}),
		...(brandId ? { brandId } : {}),
		...(inStockOnly
			? { variations: { some: { stock: { gt: 0 } } } }
			: {}),
	};
}

const UUID_PATTERN =
	/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function normalizeCursor(
	cursor: ProductCursor | null | undefined,
	sort: ProductSort,
): ProductCursor | null {
	if (
		!cursor ||
		cursor.sort !== sort ||
		typeof cursor.id !== "string" ||
		!UUID_PATTERN.test(cursor.id)
	) {
		return null;
	}

	if (sort === "featured") {
		const date = new Date(cursor.value as string);
		return Number.isNaN(date.getTime()) ? null : cursor;
	}

	return Number.isFinite(Number(cursor.value)) ? cursor : null;
}

function buildCursorCondition(
	sort: ProductSort,
	cursor: ProductCursor,
): Prisma.Sql {
	switch (sort) {
		case "price-asc":
			return Prisma.sql`(COALESCE(v.price, 0), p.id) > (${Number(cursor.value)}::int, ${cursor.id}::uuid)`;
		case "price-desc":
			return Prisma.sql`(COALESCE(v.price, 0), p.id) < (${Number(cursor.value)}::int, ${cursor.id}::uuid)`;
		case "rating":
			return Prisma.sql`(COALESCE(r.rating, 0), p.id) < (${Number(cursor.value)}::float8, ${cursor.id}::uuid)`;
		case "best-selling":
			return Prisma.sql`(COALESCE(rc."ratingCount", 0), p.id) < (${Number(cursor.value)}::int, ${cursor.id}::uuid)`;
		default:
			return Prisma.sql`(p."createdAt", p.id) < (${new Date(cursor.value as string)}, ${cursor.id}::uuid)`;
	}
}

function buildOrderBy(sort: ProductSort): Prisma.Sql {
	switch (sort) {
		case "price-asc":
			return Prisma.sql`COALESCE(v.price, 0) ASC, p.id ASC`;
		case "price-desc":
			return Prisma.sql`COALESCE(v.price, 0) DESC, p.id DESC`;
		case "rating":
			return Prisma.sql`COALESCE(r.rating, 0) DESC, p.id DESC`;
		case "best-selling":
			return Prisma.sql`COALESCE(rc."ratingCount", 0) DESC, p.id DESC`;
		default:
			return Prisma.sql`p."createdAt" DESC, p.id DESC`;
	}
}

// GET A CURSOR-PAGED PRODUCT LIST (used by endless scrolling)
export async function findProductsPage(options: ProductPageOptions = {}) {
	const limit = normalizeProductPageSize(options.limit);
	const sort = isProductSort(options.sort) ? options.sort : "featured";
	const cursor = normalizeCursor(options.cursor, sort);
	const take = limit + 1;

	const conditions: Prisma.Sql[] = [];

	if (!options.includeInactive) {
		conditions.push(Prisma.sql`p."isActive" = true`);
	}
	if (options.categoryId) {
		conditions.push(Prisma.sql`p."categoryId" = ${options.categoryId}`);
	}
	if (options.brandId) {
		conditions.push(Prisma.sql`p."brandId" = ${options.brandId}`);
	}
	if (options.inStockOnly) {
		conditions.push(
			Prisma.sql`EXISTS (
				SELECT 1 FROM variations sv
				WHERE sv."productId" = p.id AND sv.stock > 0
			)`,
		);
	}
	if (cursor) {
		conditions.push(buildCursorCondition(sort, cursor));
	}

	const whereSql =
		conditions.length > 0
			? Prisma.sql`WHERE ${Prisma.join(conditions, " AND ")}`
			: Prisma.empty;

	const rows = await prisma.$queryRaw<ProductPageRow[]>(Prisma.sql`
		SELECT
			p.id,
			COALESCE(v.price, 0)::int AS price,
			COALESCE(r.rating, 0)::float8 AS rating,
			COALESCE(rc."ratingCount", 0)::int AS "ratingCount",
			p."createdAt" AS "createdAt"
		FROM products p
		LEFT JOIN (
			SELECT "productId", MIN(price) AS price
			FROM variations
			GROUP BY "productId"
		) v ON v."productId" = p.id
		LEFT JOIN (
			SELECT "productId", AVG(value) AS rating
			FROM product_ratings
			GROUP BY "productId"
		) r ON r."productId" = p.id
		LEFT JOIN (
			SELECT "productId", COUNT(*) AS "ratingCount"
			FROM product_ratings
			GROUP BY "productId"
		) rc ON rc."productId" = p.id
		${whereSql}
		ORDER BY ${buildOrderBy(sort)}
		LIMIT ${take}
	`);

	const hasMore = rows.length > limit;
	const pageRows = hasMore ? rows.slice(0, limit) : rows;
	const last = pageRows[pageRows.length - 1];

	const nextCursor: ProductCursor | null =
		hasMore && last
			? {
					sort,
					id: last.id,
					value:
						sort === "featured"
							? last.createdAt.toISOString()
							: sort === "rating"
								? Number(last.rating)
								: sort === "best-selling"
									? Number(last.ratingCount)
									: Number(last.price),
				}
			: null;

	const ids = pageRows.map((row) => row.id);
	const products = await findProductsByIds(ids);
	const productsById = new Map(products.map((product) => [product.id, product]));

	return {
		rows: ids
			.map((id) => productsById.get(id))
			.filter((product): product is ProductRecord => Boolean(product)),
		nextCursor,
	};
}

// COUNT PRODUCTS
export function countProducts(
	filters: ProductListFilters = {},
): Promise<number> {
	return prisma.product.count({ where: buildProductWhere(filters) });
}

// GET ONE PRODUCT
export async function findProductById(id: string) {
	return prisma.product.findUnique({
		where: { id },
		include: productInclude,
	});
}

// GET MANY PRODUCTS BY IDS (cart, favorites)
export async function findProductsByIds(ids: string[]) {
	if (ids.length === 0) return [];

	return prisma.product.findMany({
		where: { id: { in: ids } },
		include: productInclude,
	});
}

// CREATE PRODUCT
export async function createProductRecord(input: ProductInput) {
	const { categoryId, brandId, variations, ...data } = input;

	return prisma.product.create({
		data: {
			...data,
			category: { connect: { id: categoryId } },
			brand: { connect: { id: brandId } },
			variations: { create: toVariationCreate(variations) },
		},
		include: productInclude,
	});
}

// UPDATE PRODUCT
export async function updateProductRecord(
	id: string,
	input: ProductUpdateInput,
) {
	const { categoryId, brandId, variations, ...data } = input;

	return prisma.product.update({
		where: { id },
		data: {
			...data,

			category: categoryId ? { connect: { id: categoryId } } : undefined,
			brand: brandId ? { connect: { id: brandId } } : undefined,

			variations:
				variations === undefined
					? undefined
					: {
							deleteMany: {},
							create: toVariationCreate(variations),
						},
		},
		include: productInclude,
	});
}

// DELETE PRODUCT
export async function deleteProductRecord(id: string) {
	return prisma.product.delete({
		where: { id },
		include: productInclude,
	});
}

// GET PUBLISHED REVIEWS FOR A PRODUCT
export async function findProductReviews(productId: string) {
	return prisma.productReview.findMany({
		where: { productId, isPublished: true },
		orderBy: { createdAt: "desc" },
	});
}

// CREATE A REVIEW AND ITS RATING
export async function createReviewRecord(input: {
	productId: string;
	rating: number;
	reviewerName: string | null;
	title: string | null;
	body: string;
}) {
	return prisma.$transaction(async (tx) => {
		const review = await tx.productReview.create({
			data: {
				productId: input.productId,
				reviewerName: input.reviewerName,
				title: input.title,
				body: input.body,
				isPublished: true,
			},
		});

		await tx.productRating.create({
			data: { productId: input.productId, value: input.rating },
		});

		return review;
	});
}
