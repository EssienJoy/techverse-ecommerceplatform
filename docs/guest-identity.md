# Guest identity, carts and browsing history

Visitors can shop without an account. Their cart and browsing history are
stored in the database against an anonymous guest session, and move into their
account when they sign up or log in.

## How it fits together

```
Browser cookie (random token, the only secret)
      | sha256
GuestSession  -- 1:1 --  Cart (guest-owned)  -- items
      |
      +---- 1:many ----  ProductView (guest-owned)

User  -- 1:1 --  Cart (user-owned)     User -- 1:many -- ProductView (user-owned)
```

- **Guest cookie** (`technest_guest`): 32 random bytes, base64url. HttpOnly,
  `SameSite=Lax`, `Secure` in production, 90 days, renewed at most once a day
  while the visitor is active. It holds no cart data.
- **GuestSession** ([guest.prisma](../prisma/models/guest.prisma)): stores only
  the SHA-256 hash of the token, so a database leak doesn't give out usable
  tokens. A client-supplied value is never trusted: it is checked for format,
  then must match an unexpired, unclaimed row.
- **Ownership**: a cart or product view belongs to exactly one of `userId` /
  `guestSessionId`. A CHECK constraint (in the migration) rejects rows with none
  or both, and unique indexes allow one cart per user and one per guest session.
- **Creation is lazy**: a guest session is only created when a visitor adds to
  the cart or a product view is recorded from a browser. Cookies can only be
  written from Server Actions, and this avoids creating rows for crawlers.

## Rules

| Situation | What happens |
| --- | --- |
| Guest adds to cart | Saved to their guest cart in the database |
| Quantity limits | Max 20 per line, max 50 lines, and never more than stock. Enforced in the database update, so concurrent requests can't exceed them |
| Sign up | Guest cart and history move into the new account |
| Log in | Guest cart is merged into the account's cart: quantities are summed and capped at stock; sold-out or inactive items are dropped; lines already in the account's cart are never reduced |
| History on merge | One row per product; view counts added together, latest timestamp kept; newest 50 kept |
| Log out | The account's cart and history stay on the account. The next visitor starts a fresh guest session |
| Admins | Have no cart or history. Guest data is not merged into admin accounts |
| Guest cookie expires | The visitor gets a new, empty session. The old cart can't be reached by guessing; it is deleted by the cleanup job |

The merge ([merge-guest.service.ts](../src/features/guest/server/merge-guest.service.ts))
runs in a single transaction. It first claims the guest session with a
conditional update, so a session can be claimed only once, by one account,
even if two requests race or a cookie is replayed. If anything fails, nothing
moves and the guest cookie is kept. The cookie is deleted only after the merge
commits. Login never fails because a merge did.

## Code map

- `src/features/guest/server/` : cookie and session ([guest-session.ts](../src/features/guest/server/guest-session.ts)), repository, merge service
- `src/features/cart/server/` : `customer-user.ts` decides who owns the request's cart; repository, service and thin actions
- `src/features/history/` : view repository/service/action, `ProductViewTracker`
- `src/features/storefront/components/RecentlyViewed.tsx` : the home page section

## Operations

- Apply the migration: `npx prisma migrate deploy --config prisma7.config.ts`
- Delete expired sessions (and their carts and views), e.g. daily: `npm run guests:purge`

## Not covered yet

- **Saved items** are still browser-only for guests; they use the same pattern and can be moved onto guest sessions next.
- **Rate limiting** of guest session creation. Lazy creation, the cart limits and the cleanup job bound the damage, but a per-IP limit needs infrastructure the project doesn't have yet.
- **Merge notice**: dropped or reduced items are not shown to the user after login; the cart simply shows what was kept.
- **Stock is not reserved** by the cart. It is checked when adding and merging; reserving belongs with real orders.
