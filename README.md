# TechNest

TechNest is an e-commerce storefront and admin dashboard for browsing and managing consumer technology products. The application is built with Next.js App Router, React, TypeScript, PostgreSQL, and Prisma ORM 7.

> **Prototype status:** Checkout is simulated and does not charge a payment method, and orders are stored in browser state. Do not treat these flows as production-ready payment processing or order persistence.

## Features

- Storefront pages for home, shop, search, saved items, cart, checkout, and order tracking
- Admin pages for products, categories, brands, banners, hero slides, flash sales, analytics, customers, and orders
- Product variations with SKU, color, size, price, stock, and images
- PostgreSQL persistence through Prisma ORM 7 and the Prisma PostgreSQL adapter
- Shared UI components, Zod schemas, and client-side state stores

## Requirements

- Node.js compatible with the installed Next.js 16 release
- npm
- PostgreSQL

## Local Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and configure the values. At minimum, set `DATABASE_URL` to a reachable PostgreSQL database. For example:

   ```dotenv
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/technest?schema=public"
   JWT_SECRET="replace-with-a-long-random-secret"
   JWT_EXPIRES="90d"
   JWT_COOKIE_EXPIRES_IN="90"
   SESSION_COOKIE="technest_session"
   ```

   Use a unique, strong `JWT_SECRET`. Keep `.env` private and out of version control.

   Image uploads also require the `CLOUDINARY_*` variables described in [Image Storage](#image-storage).

3. Apply database migrations and generate the Prisma client:

   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

   Prisma reads the schema from `prisma/`, migration files from `prisma/migrations/`, and the database URL from `prisma7.config.ts`. The generated client is written to `src/generated/prisma/`.

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable                    | Purpose                                                                                      |
| --------------------------- | -------------------------------------------------------------------------------------------- |
| `DATABASE_URL`              | PostgreSQL connection string used by Prisma and the app                                      |
| `JWT_SECRET`                | Secret used to sign admin session JWTs                                                       |
| `JWT_EXPIRES`               | JWT lifetime, e.g. `90d`                                                                     |
| `JWT_COOKIE_EXPIRES_IN`     | Session cookie lifetime in days                                                              |
| `SESSION_COOKIE`            | Name of the admin session cookie                                                             |
| `CLOUDINARY_CLOUD_NAME`     | Cloud name from the Cloudinary dashboard                                                     |
| `CLOUDINARY_API_KEY`        | Cloudinary API key used for signed server-side uploads                                      |
| `CLOUDINARY_API_SECRET`     | Cloudinary API secret; server-only, never expose to the browser                              |
| `CLOUDINARY_UPLOAD_FOLDER`  | Cloudinary folder for uploads; defaults to `technest`                                        |

## Image Storage

Product and content images are uploaded to Cloudinary and delivered from its public CDN. Delivery URLs are public, stable, and cacheable, so the app does not generate presigned URLs.

Uploads are signed server-side by the admin upload actions using the API key and secret. No unsigned upload preset is required, and the API secret must never use a `NEXT_PUBLIC_` prefix. `next.config.ts` allowlists `res.cloudinary.com` in `images.remotePatterns` for `next/image`.

To configure it:

1. Create a Cloudinary account and open the dashboard.
2. Copy the cloud name, API key, and API secret into `.env`.
3. Optionally set `CLOUDINARY_UPLOAD_FOLDER` (defaults to `technest`).

Uploads are restricted to PNG, JPG, JPEG, WEBP, GIF, AVIF, and SVG, both in the app and on Cloudinary.

Product and content uploads can optionally remove their background using Cloudinary's `background_removal` transformation. Select **Remove background (AI)** after choosing a file, or **Remove backgrounds on new images (AI)** for variation images. This supports PNG, JPG, WEBP, and AVIF. Each removal counts as a special Cloudinary transformation, so it uses account credits; no add-on subscription is needed for accounts created after February 1, 2026.

Without valid credentials, uploads fail with `Image storage is not configured.`

## Admin Access

The admin console requires a signed-in account. The super admin is created directly in the database (store the password as a bcrypt hash). Super admins can then create admin accounts from `/admin/signup`.

## Common Commands

| Command                  | Purpose                                          |
| ------------------------ | ------------------------------------------------ |
| `npm run dev`            | Start the Next.js development server             |
| `npm run build`          | Build the application for production             |
| `npm start`              | Start the production server after building       |
| `npm run lint`           | Run ESLint                                       |
| `npx tsc --noEmit`       | Type-check the TypeScript project                |
| `npx prisma validate`    | Validate the Prisma schema                       |
| `npx prisma migrate dev` | Create and apply development database migrations |
| `npx prisma generate`    | Generate the Prisma Client                       |
| `npx prisma db seed`     | Run the database seed script                     |

There is currently no test script defined in `package.json`.

> **Seed warning:** `prisma/seed.ts` deletes existing products, product variations and images, flash sales, banners, hero slides, brands, categories, and store settings before upserting the admin accounts. Run it only against a disposable or intentionally reset database.

## Project Structure

```text
prisma/
  models/          Prisma model definitions
  migrations/      SQL migration history
  seed.ts          Development seed/reset script
src/
  app/             Next.js routes and layouts
  features/        Product, admin, auth, cart, checkout, content, and storefront domains
  generated/prisma Generated Prisma Client; do not edit manually
  prisma-client/   Prisma Client and PostgreSQL adapter setup
  shared/          Shared components, configuration, contexts, schemas, and utilities
    lib/           Upload (Cloudinary) and image validation utilities
```

## Database Workflow

Edit Prisma definitions in `prisma/models/` and keep the migration history in `prisma/migrations/` aligned with those changes. For a schema change, validate it, create and review a migration, apply it to the development database, and regenerate the client:

```bash
npx prisma validate
npx prisma migrate dev --create-only --name describe_the_change
# Review the generated SQL before applying it.
npx prisma migrate dev
npx prisma generate
```

Do not edit files under `src/generated/prisma/` directly. Generated types are refreshed with `prisma generate`.

## Prototype Limitations

- The checkout UI is a demonstration; it does not connect to a payment provider.
- Cart, saved-item, checkout, and order state use browser-side stores and are not a substitute for server-side order and inventory processing.
- Image uploads require Cloudinary credentials. Files uploaded before the Cloudinary switch may still live under `public/uploads/`.
