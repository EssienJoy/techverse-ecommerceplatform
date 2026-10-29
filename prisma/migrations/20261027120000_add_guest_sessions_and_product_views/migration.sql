-- Guest identity, guest-owned carts and browsing history.
-- Carts and product views belong to exactly one owner: a user OR a guest session.

-- AlterTable
ALTER TABLE "carts" ADD COLUMN     "guestSessionId" UUID,
ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable: new accounts are customers unless a role is given explicitly
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'user';

-- CreateTable
CREATE TABLE "guest_sessions" (
    "id" UUID NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "claimedAt" TIMESTAMP(3),
    "claimedByUserId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "guest_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_views" (
    "id" UUID NOT NULL,
    "userId" UUID,
    "guestSessionId" UUID,
    "productId" UUID NOT NULL,
    "viewCount" INTEGER NOT NULL DEFAULT 1,
    "lastViewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_views_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "guest_sessions_tokenHash_key" ON "guest_sessions"("tokenHash");

-- CreateIndex
CREATE INDEX "guest_sessions_expiresAt_idx" ON "guest_sessions"("expiresAt");

-- CreateIndex
CREATE INDEX "product_views_userId_lastViewedAt_idx" ON "product_views"("userId", "lastViewedAt");

-- CreateIndex
CREATE INDEX "product_views_guestSessionId_lastViewedAt_idx" ON "product_views"("guestSessionId", "lastViewedAt");

-- CreateIndex
CREATE UNIQUE INDEX "product_views_userId_productId_key" ON "product_views"("userId", "productId");

-- CreateIndex
CREATE UNIQUE INDEX "product_views_guestSessionId_productId_key" ON "product_views"("guestSessionId", "productId");

-- CreateIndex
CREATE UNIQUE INDEX "carts_guestSessionId_key" ON "carts"("guestSessionId");

-- AddForeignKey
ALTER TABLE "carts" ADD CONSTRAINT "carts_guestSessionId_fkey" FOREIGN KEY ("guestSessionId") REFERENCES "guest_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_views" ADD CONSTRAINT "product_views_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_views" ADD CONSTRAINT "product_views_guestSessionId_fkey" FOREIGN KEY ("guestSessionId") REFERENCES "guest_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_views" ADD CONSTRAINT "product_views_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Ownership rules Prisma's schema can't express: exactly one owner per row.
-- Together with the unique indexes above (nulls don't collide), this means
-- one cart per user, one cart per guest session, and no ownerless carts.
ALTER TABLE "carts" ADD CONSTRAINT "carts_exactly_one_owner"
    CHECK (num_nonnulls("userId", "guestSessionId") = 1);

ALTER TABLE "product_views" ADD CONSTRAINT "product_views_exactly_one_owner"
    CHECK (num_nonnulls("userId", "guestSessionId") = 1);
