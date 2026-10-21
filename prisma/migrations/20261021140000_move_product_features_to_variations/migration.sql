-- AlterTable
ALTER TABLE "variations" ADD COLUMN "features" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

-- Backfill variation features from the product-level features
UPDATE "variations"
SET "features" = COALESCE("products"."features", ARRAY[]::TEXT[])
FROM "products"
WHERE "variations"."productId" = "products"."id";

-- AlterTable
ALTER TABLE "products" DROP COLUMN "features";
