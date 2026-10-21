-- CreateTable
CREATE TABLE "product_variants" (
    "id" TEXT NOT NULL,
    "productId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "price" DECIMAL(12,2) NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_variants_pkey" PRIMARY KEY ("id")
);

-- Backfill existing products as a single default purchasable variant.
INSERT INTO "product_variants" (
    "id",
    "productId",
    "name",
    "sku",
    "price",
    "stock",
    "createdAt",
    "updatedAt"
)
SELECT
    'legacy-' || "id"::TEXT,
    "id",
    'Default',
    'LEGACY-' || UPPER("id"::TEXT),
    "price",
    "stock",
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM "products";

-- AlterTable
ALTER TABLE "product_images" ADD COLUMN "variationId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "product_variants_sku_key" ON "product_variants"("sku");
CREATE INDEX "product_variants_productId_idx" ON "product_variants"("productId");
CREATE INDEX "product_images_variationId_idx" ON "product_images"("variationId");

-- AddForeignKey
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "product_images" ADD CONSTRAINT "product_images_variationId_fkey" FOREIGN KEY ("variationId") REFERENCES "product_variations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
