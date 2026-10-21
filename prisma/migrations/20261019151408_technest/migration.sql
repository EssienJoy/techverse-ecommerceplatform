-- AlterTable
ALTER TABLE "product_ratings" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "product_reviews" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;
