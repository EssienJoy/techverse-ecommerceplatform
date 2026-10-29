# Stripe Checkout

Card payments go through [Stripe Checkout](https://docs.stripe.com/payments/checkout),
a page hosted by Stripe. Card numbers never reach this app or its database: the
shipping form asks Stripe to create a Checkout Session and then sends the browser
to that session's `url`. Stripe returns the browser to `/checkout/success` after
payment and to `/checkout` when the customer cancels.

## Flow

1. **Shipping form** ([checkout/page.tsx](../src/app/(customer)/(store)/checkout/page.tsx))
   posts to `startCheckoutSession` in
   [checkout.service.ts](../src/features/checkout/server/checkout.service.ts).
2. **The action** re-checks the signed-in customer, validates the address, and
   loads the cart with `getCart({ userId })`. Prices come from that cart, never
   from the form, so the browser cannot change what it is charged.
3. **Line items** are built from the priced cart. Totals come from
   [totals.ts](../src/features/checkout/lib/totals.ts), the same helper the order
   summary uses, so the screen and the charge cannot disagree.
4. **The session** is created by `createCheckoutSession` in
   [checkout.repository.ts](../src/features/checkout/server/checkout.repository.ts),
   and the action redirects to Stripe. The shipping address is stored in the
   session's `metadata` (`userId`, `ship_name`, `ship_email`, `ship_address`,
   `ship_city`, `ship_postal`, `ship_phone`), one key per field because Stripe
   caps each metadata value at 500 characters.
5. **The success page** ([checkout/success/page.tsx](../src/app/(customer)/(store)/checkout/success/page.tsx))
   reads `?session_id=...`, loads the session with the secret key, and only
   shows an order when Stripe says `payment_status === "paid"` and the session's
   `metadata.userId` matches the signed-in customer. Everything shown (items,
   tax, shipping, total) is derived from the retrieved session, not the URL.
6. **OrderConfirmation** ([OrderConfirmation.tsx](../src/features/checkout/components/OrderConfirmation.tsx))
   clears the cart and saves the order in the local order store (see the
   limitations below).

`/checkout/payment` no longer has a card form. It keeps the customer-only guard
and redirects to `/checkout`, so old links still work.

## Money

- The currency is `siteConfig.currency` lowercased (`ngn`).
- Product prices are stored in whole naira, so line items and shipping are
  multiplied by 100 to reach Stripe's smallest unit (kobo).
- Tax is 8% and is sent as its own line item named "Estimated tax" with
  `metadata.kind = "tax"`. The success page uses that marker to separate tax from
  products.
- Shipping is added with `shipping_options` when the fee is not zero, so Stripe
  shows it as shipping rather than as a product.

## Environment

| Variable | Required | Purpose |
| --- | --- | --- |
| `STRIPE_SECRET_KEY` | Yes | Server-side key used to create and retrieve sessions. Use a test key (`sk_test_...`) while developing. |
| `NEXT_PUBLIC_APP_URL` | In production | Base URL for the success and cancel redirects. In development the request's host header is used instead. |

`.env.example` lists both.

## Trying it

Run `npm run dev`, sign in as a customer with something in the cart, fill in the
shipping form, and use a Stripe test card on the hosted page:

| Card | Result |
| --- | --- |
| `4242 4242 4242 4242` | Payment succeeds |
| `4000 0027 6000 3184` | Requires 3-D Secure authentication |
| `4000 0000 0000 0002` | Card is declined |

Any future expiry date and any CVC work in test mode. Cancelling on Stripe
returns to `/checkout` with the cart intact.

## Limitations

- Orders are still saved in the browser. Stripe payment state is verified on the
  success page, but there is no order table yet, so a customer who clears their
  browser loses the order and `/track/[orderId]` cannot find it.
- Nothing decrements stock when a payment succeeds.
- Both are fixed by a `checkout.session.completed` webhook that writes the order
  and adjusts stock. Until then, treat the browser order as a receipt, not as
  the source of truth.
