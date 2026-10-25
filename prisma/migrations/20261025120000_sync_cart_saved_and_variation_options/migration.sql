-- Brings the database in line with the Prisma schema:
-- cart/saved parent tables, variation options, nullable user names,
-- and removal of the retired banners and flash sale tables.
-- Existing cart items, saved items, variant images and variation
-- color/size values are preserved.

-- AlterEnum
ALTER TYPE "user_role" ADD VALUE IF NOT EXISTS 'user';

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "name" DROP NOT NULL;

-- AlterTable
ALTER TABLE "products" ADD COLUMN "hasVariations" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "product_reviews" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- Rename "VariantImage" to "variant_images" (keeps existing images)
ALTER TABLE "VariantImage" DROP CONSTRAINT "VariantImage_variationId_fkey";
ALTER TABLE "VariantImage" RENAME TO "variant_images";
ALTER TABLE "variant_images" RENAME CONSTRAINT "VariantImage_pkey" TO "variant_images_pkey";

-- CreateTable
CREATE TABLE "variation_options" (
    "id" UUID NOT NULL,
    "variationId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "variation_options_pkey" PRIMARY KEY ("id")
);

-- Move variation color/size into variation_options
INSERT INTO "variation_options" ("id", "variationId", "name", "value")
SELECT gen_random_uuid(), "id", 'color', "color" FROM "variations" WHERE btrim("color") <> '';

INSERT INTO "variation_options" ("id", "variationId", "name", "value")
SELECT gen_random_uuid(), "id", 'size', "size" FROM "variations" WHERE btrim("size") <> '';

-- AlterTable
ALTER TABLE "variations" DROP COLUMN "color",
DROP COLUMN "size",
ADD COLUMN "isDefault" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "carts" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "carts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saved" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "saved_pkey" PRIMARY KEY ("id")
);

-- Backfill one cart per user that has cart items, then link the items
INSERT INTO "carts" ("id", "userId", "updatedAt")
SELECT gen_random_uuid(), "userId", CURRENT_TIMESTAMP
FROM (SELECT DISTINCT "userId" FROM "cart_items") AS u;

ALTER TABLE "cart_items" DROP CONSTRAINT "cart_items_userId_fkey";
DROP INDEX "cart_items_userId_itemKey_key";
ALTER TABLE "cart_items" ADD COLUMN "cartId" UUID;
UPDATE "cart_items" AS ci SET "cartId" = c."id" FROM "carts" AS c WHERE c."userId" = ci."userId";
ALTER TABLE "cart_items" ALTER COLUMN "cartId" SET NOT NULL;
ALTER TABLE "cart_items" DROP COLUMN "userId";

-- Backfill one saved list per user that has saved items, then link the items
INSERT INTO "saved" ("id", "userId", "updatedAt")
SELECT gen_random_uuid(), "userId", CURRENT_TIMESTAMP
FROM (SELECT DISTINCT "userId" FROM "saved_items") AS u;

ALTER TABLE "saved_items" DROP CONSTRAINT "saved_items_userId_fkey";
DROP INDEX "saved_items_userId_productId_key";
ALTER TABLE "saved_items" ADD COLUMN "savedId" UUID,
ADD COLUMN "variationId" UUID;
UPDATE "saved_items" AS si SET "savedId" = s."id" FROM "saved" AS s WHERE s."userId" = si."userId";
ALTER TABLE "saved_items" ALTER COLUMN "savedId" SET NOT NULL;
ALTER TABLE "saved_items" DROP COLUMN "userId";

-- DropTable (retired features, no longer in the schema)
DROP TABLE "flash_sale_items";
DROP TABLE "flash_sales";
DROP TABLE "banners";

-- CreateIndex
CREATE UNIQUE INDEX "carts_userId_key" ON "carts"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "saved_userId_key" ON "saved"("userId");

-- CreateIndex
CREATE INDEX "variation_options_variationId_idx" ON "variation_options"("variationId");

-- CreateIndex
CREATE UNIQUE INDEX "variation_options_variationId_name_key" ON "variation_options"("variationId", "name");

-- CreateIndex
CREATE INDEX "variant_images_variationId_idx" ON "variant_images"("variationId");

-- CreateIndex
CREATE UNIQUE INDEX "cart_items_cartId_itemKey_key" ON "cart_items"("cartId", "itemKey");

-- CreateIndex
CREATE UNIQUE INDEX "saved_items_savedId_variationId_key" ON "saved_items"("savedId", "variationId");

-- CreateIndex
CREATE INDEX "variations_productId_idx" ON "variations"("productId");

-- AddForeignKey
ALTER TABLE "carts" ADD CONSTRAINT "carts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "carts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved" ADD CONSTRAINT "saved_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_items" ADD CONSTRAINT "saved_items_savedId_fkey" FOREIGN KEY ("savedId") REFERENCES "saved"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_items" ADD CONSTRAINT "saved_items_variationId_fkey" FOREIGN KEY ("variationId") REFERENCES "variations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "variation_options" ADD CONSTRAINT "variation_options_variationId_fkey" FOREIGN KEY ("variationId") REFERENCES "variations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "variant_images" ADD CONSTRAINT "variant_images_variationId_fkey" FOREIGN KEY ("variationId") REFERENCES "variations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
