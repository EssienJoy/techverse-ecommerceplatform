BEGIN;

CREATE TEMP TABLE "_uuid_id_map" (
    "model" TEXT NOT NULL,
    "oldId" TEXT NOT NULL,
    "newId" UUID NOT NULL,
    PRIMARY KEY ("model", "oldId"),
    UNIQUE ("model", "newId")
) ON COMMIT DROP;

INSERT INTO "_uuid_id_map" ("model", "oldId", "newId")
SELECT 'Brand', "id", gen_random_uuid() FROM "brands"
UNION ALL
SELECT 'Category', "id", gen_random_uuid() FROM "categories"
UNION ALL
SELECT 'Collection', "id", gen_random_uuid() FROM "collections"
UNION ALL
SELECT 'Variations', "id", gen_random_uuid() FROM "variations"
UNION ALL
SELECT 'VariantImage', "id", gen_random_uuid() FROM "VariantImage"
UNION ALL
SELECT 'ProductReview', "id", gen_random_uuid() FROM "product_reviews"
UNION ALL
SELECT 'ProductRating', "id", gen_random_uuid() FROM "product_ratings"
UNION ALL
SELECT 'HeroSlide', "id", gen_random_uuid() FROM "hero_slides"
UNION ALL
SELECT 'CartItem', "id", gen_random_uuid() FROM "cart_items"
UNION ALL
SELECT 'SavedItem', "id", gen_random_uuid() FROM "saved_items"
UNION ALL
SELECT 'Settings', "id", gen_random_uuid() FROM "settings";

ALTER TABLE "products" DROP CONSTRAINT "products_categoryId_fkey";
ALTER TABLE "products" DROP CONSTRAINT "products_brandId_fkey";
ALTER TABLE "VariantImage" DROP CONSTRAINT "VariantImage_variationId_fkey";
ALTER TABLE "collection_products" DROP CONSTRAINT "collection_products_collectionId_fkey";
ALTER TABLE "cart_items" DROP CONSTRAINT "cart_items_variationId_fkey";

ALTER TABLE "products" ADD COLUMN "_categoryId_uuid" UUID;
ALTER TABLE "products" ADD COLUMN "_brandId_uuid" UUID;
UPDATE "products" AS p
SET "_categoryId_uuid" = m."newId"
FROM "_uuid_id_map" AS m
WHERE m."model" = 'Category' AND m."oldId" = p."categoryId";
UPDATE "products" AS p
SET "_brandId_uuid" = m."newId"
FROM "_uuid_id_map" AS m
WHERE m."model" = 'Brand' AND m."oldId" = p."brandId";
DROP INDEX "products_categoryId_idx";
DROP INDEX "products_brandId_idx";
ALTER TABLE "products" DROP COLUMN "categoryId";
ALTER TABLE "products" RENAME COLUMN "_categoryId_uuid" TO "categoryId";
ALTER TABLE "products" ALTER COLUMN "categoryId" SET NOT NULL;
ALTER TABLE "products" DROP COLUMN "brandId";
ALTER TABLE "products" RENAME COLUMN "_brandId_uuid" TO "brandId";
ALTER TABLE "products" ALTER COLUMN "brandId" SET NOT NULL;

ALTER TABLE "VariantImage" ADD COLUMN "_variationId_uuid" UUID;
UPDATE "VariantImage" AS vi
SET "_variationId_uuid" = m."newId"
FROM "_uuid_id_map" AS m
WHERE m."model" = 'Variations' AND m."oldId" = vi."variationId";
ALTER TABLE "VariantImage" DROP COLUMN "variationId";
ALTER TABLE "VariantImage" RENAME COLUMN "_variationId_uuid" TO "variationId";
ALTER TABLE "VariantImage" ALTER COLUMN "variationId" SET NOT NULL;

ALTER TABLE "collection_products" ADD COLUMN "_collectionId_uuid" UUID;
UPDATE "collection_products" AS cp
SET "_collectionId_uuid" = m."newId"
FROM "_uuid_id_map" AS m
WHERE m."model" = 'Collection' AND m."oldId" = cp."collectionId";
ALTER TABLE "collection_products" DROP CONSTRAINT "collection_products_pkey";
ALTER TABLE "collection_products" DROP COLUMN "collectionId";
ALTER TABLE "collection_products" RENAME COLUMN "_collectionId_uuid" TO "collectionId";
ALTER TABLE "collection_products" ALTER COLUMN "collectionId" SET NOT NULL;
ALTER TABLE "collection_products"
ADD CONSTRAINT "collection_products_pkey" PRIMARY KEY ("collectionId", "productId");

ALTER TABLE "cart_items" ADD COLUMN "_variationId_uuid" UUID;
UPDATE "cart_items" AS ci
SET "_variationId_uuid" = m."newId"
FROM "_uuid_id_map" AS m
WHERE m."model" = 'Variations' AND m."oldId" = ci."variationId";
ALTER TABLE "cart_items" DROP COLUMN "variationId";
ALTER TABLE "cart_items" RENAME COLUMN "_variationId_uuid" TO "variationId";

ALTER TABLE "brands" ADD COLUMN "_id_uuid" UUID;
UPDATE "brands" AS t SET "_id_uuid" = m."newId"
FROM "_uuid_id_map" AS m WHERE m."model" = 'Brand' AND m."oldId" = t."id";
ALTER TABLE "brands" DROP CONSTRAINT "brands_pkey";
ALTER TABLE "brands" DROP COLUMN "id";
ALTER TABLE "brands" RENAME COLUMN "_id_uuid" TO "id";
ALTER TABLE "brands" ADD CONSTRAINT "brands_pkey" PRIMARY KEY ("id");

ALTER TABLE "categories" ADD COLUMN "_id_uuid" UUID;
UPDATE "categories" AS t SET "_id_uuid" = m."newId"
FROM "_uuid_id_map" AS m WHERE m."model" = 'Category' AND m."oldId" = t."id";
ALTER TABLE "categories" DROP CONSTRAINT "categories_pkey";
ALTER TABLE "categories" DROP COLUMN "id";
ALTER TABLE "categories" RENAME COLUMN "_id_uuid" TO "id";
ALTER TABLE "categories" ADD CONSTRAINT "categories_pkey" PRIMARY KEY ("id");

ALTER TABLE "collections" ADD COLUMN "_id_uuid" UUID;
UPDATE "collections" AS t SET "_id_uuid" = m."newId"
FROM "_uuid_id_map" AS m WHERE m."model" = 'Collection' AND m."oldId" = t."id";
ALTER TABLE "collections" DROP CONSTRAINT "collections_pkey";
ALTER TABLE "collections" DROP COLUMN "id";
ALTER TABLE "collections" RENAME COLUMN "_id_uuid" TO "id";
ALTER TABLE "collections" ADD CONSTRAINT "collections_pkey" PRIMARY KEY ("id");

ALTER TABLE "variations" ADD COLUMN "_id_uuid" UUID;
UPDATE "variations" AS t SET "_id_uuid" = m."newId"
FROM "_uuid_id_map" AS m WHERE m."model" = 'Variations' AND m."oldId" = t."id";
ALTER TABLE "variations" DROP CONSTRAINT "variations_pkey";
ALTER TABLE "variations" DROP COLUMN "id";
ALTER TABLE "variations" RENAME COLUMN "_id_uuid" TO "id";
ALTER TABLE "variations" ADD CONSTRAINT "variations_pkey" PRIMARY KEY ("id");

ALTER TABLE "VariantImage" ADD COLUMN "_id_uuid" UUID;
UPDATE "VariantImage" AS t SET "_id_uuid" = m."newId"
FROM "_uuid_id_map" AS m WHERE m."model" = 'VariantImage' AND m."oldId" = t."id";
ALTER TABLE "VariantImage" DROP CONSTRAINT "VariantImage_pkey";
ALTER TABLE "VariantImage" DROP COLUMN "id";
ALTER TABLE "VariantImage" RENAME COLUMN "_id_uuid" TO "id";
ALTER TABLE "VariantImage" ADD CONSTRAINT "VariantImage_pkey" PRIMARY KEY ("id");

ALTER TABLE "product_reviews" ADD COLUMN "_id_uuid" UUID;
UPDATE "product_reviews" AS t SET "_id_uuid" = m."newId"
FROM "_uuid_id_map" AS m WHERE m."model" = 'ProductReview' AND m."oldId" = t."id";
ALTER TABLE "product_reviews" DROP CONSTRAINT "product_reviews_pkey";
ALTER TABLE "product_reviews" DROP COLUMN "id";
ALTER TABLE "product_reviews" RENAME COLUMN "_id_uuid" TO "id";
ALTER TABLE "product_reviews" ADD CONSTRAINT "product_reviews_pkey" PRIMARY KEY ("id");

ALTER TABLE "product_ratings" ADD COLUMN "_id_uuid" UUID;
UPDATE "product_ratings" AS t SET "_id_uuid" = m."newId"
FROM "_uuid_id_map" AS m WHERE m."model" = 'ProductRating' AND m."oldId" = t."id";
ALTER TABLE "product_ratings" DROP CONSTRAINT "product_ratings_pkey";
ALTER TABLE "product_ratings" DROP COLUMN "id";
ALTER TABLE "product_ratings" RENAME COLUMN "_id_uuid" TO "id";
ALTER TABLE "product_ratings" ADD CONSTRAINT "product_ratings_pkey" PRIMARY KEY ("id");

ALTER TABLE "hero_slides" ADD COLUMN "_id_uuid" UUID;
UPDATE "hero_slides" AS t SET "_id_uuid" = m."newId"
FROM "_uuid_id_map" AS m WHERE m."model" = 'HeroSlide' AND m."oldId" = t."id";
ALTER TABLE "hero_slides" DROP CONSTRAINT "hero_slides_pkey";
ALTER TABLE "hero_slides" DROP COLUMN "id";
ALTER TABLE "hero_slides" RENAME COLUMN "_id_uuid" TO "id";
ALTER TABLE "hero_slides" ADD CONSTRAINT "hero_slides_pkey" PRIMARY KEY ("id");

ALTER TABLE "cart_items" ADD COLUMN "_id_uuid" UUID;
UPDATE "cart_items" AS t SET "_id_uuid" = m."newId"
FROM "_uuid_id_map" AS m WHERE m."model" = 'CartItem' AND m."oldId" = t."id";
ALTER TABLE "cart_items" DROP CONSTRAINT "cart_items_pkey";
ALTER TABLE "cart_items" DROP COLUMN "id";
ALTER TABLE "cart_items" RENAME COLUMN "_id_uuid" TO "id";
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_pkey" PRIMARY KEY ("id");

ALTER TABLE "saved_items" ADD COLUMN "_id_uuid" UUID;
UPDATE "saved_items" AS t SET "_id_uuid" = m."newId"
FROM "_uuid_id_map" AS m WHERE m."model" = 'SavedItem' AND m."oldId" = t."id";
ALTER TABLE "saved_items" DROP CONSTRAINT "saved_items_pkey";
ALTER TABLE "saved_items" DROP COLUMN "id";
ALTER TABLE "saved_items" RENAME COLUMN "_id_uuid" TO "id";
ALTER TABLE "saved_items" ADD CONSTRAINT "saved_items_pkey" PRIMARY KEY ("id");

ALTER TABLE "settings" ADD COLUMN "_id_uuid" UUID;
UPDATE "settings" AS t SET "_id_uuid" = m."newId"
FROM "_uuid_id_map" AS m WHERE m."model" = 'Settings' AND m."oldId" = t."id";
ALTER TABLE "settings" DROP CONSTRAINT "settings_pkey";
ALTER TABLE "settings" DROP COLUMN "id";
ALTER TABLE "settings" RENAME COLUMN "_id_uuid" TO "id";
ALTER TABLE "settings" ADD CONSTRAINT "settings_pkey" PRIMARY KEY ("id");

CREATE INDEX "products_categoryId_idx" ON "products"("categoryId");
CREATE INDEX "products_brandId_idx" ON "products"("brandId");

ALTER TABLE "products" ADD CONSTRAINT "products_categoryId_fkey"
FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "products" ADD CONSTRAINT "products_brandId_fkey"
FOREIGN KEY ("brandId") REFERENCES "brands"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "VariantImage" ADD CONSTRAINT "VariantImage_variationId_fkey"
FOREIGN KEY ("variationId") REFERENCES "variations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "collection_products" ADD CONSTRAINT "collection_products_collectionId_fkey"
FOREIGN KEY ("collectionId") REFERENCES "collections"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_variationId_fkey"
FOREIGN KEY ("variationId") REFERENCES "variations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT;
