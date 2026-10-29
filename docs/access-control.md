# Access control

How TechNest decides who can see and do what. There are three kinds of visitor:

- **Guest**: not signed in.
- **Customer**: signed in with role `user`.
- **Admin**: signed in with role `admin` or `super_admin`.

## Route rules

| Route | Guest | Customer | Admin |
| --- | --- | --- | --- |
| `/checkout`, `/checkout/payment`, `/checkout/success` | Redirect to `/login?next=<path>` | Allowed | Redirect to `/` |
| `/profile` | Redirect to `/login?next=/profile` | Allowed | Allowed |
| `/admin/*` | Redirect to `/admin/login` | Redirect to `/` | Allowed |
| `/admin/signup` | Redirect to `/admin/login` | Redirect to `/` | Super admin only; other admins go to `/admin` |
| `/login`, `/signup`, `/admin/login` | Allowed | Redirect to `/` | Redirect to `/admin` |
| Storefront (`/`, `/shop`, `/cart`, `/saved`, ...) | Allowed | Allowed | Allowed (browse only) |

A session cookie that no longer matches an active account (deleted, deactivated
or reseeded user) is treated like a guest: protected pages send it to login, and
it can still open the sign-in pages so the visitor can sign in again.

After signing in or signing up, a customer is sent back to the page in `next`
(for example `/checkout`). Admins always go to `/admin`.

## What admins can and cannot do

- Admins can create, edit, update and delete products and manage store content.
- Admins cannot add to the cart, save products, check out or place an order.
- Customers cannot use any admin page or admin action.

## Three layers of protection

1. **The user read (pages and components)**: `getCurrentUser()` in
   [user.service.ts](../src/features/auth/server/user.service.ts) resolves the
   signed-in user from the id in the verified session, through
   `getUserById(userId)`. Pages, layouts and components use it to decide what to
   render and which actions to offer. It is a read, not a security boundary.
2. **The proxy ([src/proxy.ts](../src/proxy.ts))**: a fast filter for visitors
   with no valid session. It only verifies the signed cookie and never looks at
   the role, because a cookie can outlive its account. Without a valid cookie,
   `/admin/*` goes to `/admin/login` and `/profile` and `/checkout` go to
   `/login?next=...`.
3. **The backend guard**
   ([authorization.ts](../src/features/auth/server/middleware/authorization.ts)):
   server code that reads or writes data on someone's behalf authenticates and
   authorizes as two separate steps, so a page's render decision can never be
   the thing that protects the database:
   - `protect()` checks the `Authorization: Bearer <token>` header or the
     session cookie and returns the user id. It reads no rows and has no
     opinion about roles: a token only proves an id.
   - `authorize(userId, roles)` loads that id and checks the account is active
     and holds one of the roles.
   - `guard(roles)` runs both and returns a result (401 when signed out, 403 for
     the wrong role, 500 on a database failure). The admin-only reads in
     products and content call it before querying; the profile actions use it
     before updating the account.
   - `restrictTo(roles, options)` is the same two steps for pages and server
     actions, with a choice: return a result, or `{ redirect: true }` to send
     the visitor to the sign-in or forbidden page. The checkout action uses it
     to require the `user` role.

   These database checks catch a changed role, a deactivated account or an old
   cookie (cookies last 90 days). The pages below also guard themselves so a
   visitor never sees a form they cannot submit:
   - [(admin)/admin/layout.tsx](../src/app/(admin)/admin/layout.tsx): no account
     goes to `/admin/login`; a customer goes to `/`.
   - [(auth)/(guest)/layout.tsx](../src/app/(auth)/(guest)/layout.tsx): turns
     signed-in users away from `/login`, `/signup` and `/admin/login`. It renders
     nothing until the check passes, so the form doesn't flash. `/admin/signup`
     sits outside this group because super admins use it.
   - [checkout/page.tsx](../src/app/(customer)/(store)/checkout/page.tsx) and
     [checkout/success/page.tsx](../src/app/(customer)/(store)/checkout/success/page.tsx)
     each allow only customers; admins go to `/`.
     [checkout/payment/page.tsx](../src/app/(customer)/(store)/checkout/payment/page.tsx)
     keeps the same guard and then redirects to `/checkout`, because payment now
     happens on Stripe's hosted page.
   - Cart and saved item actions use `requireShopperId()` from
     [customer-user.ts](../src/features/cart/server/customer-user.ts). It returns
     `null` for guests (their cart stays in the browser) and throws for admins.
     Read actions use `getActiveCustomerId()`, which returns `null` for guests
     and admins.

## Client behaviour for admins

[ShoppingListsSync](../src/features/cart/components/ShoppingListsSync.tsx) records
whether the viewer is an admin in `useViewerStore`. The cart and favourites
stores then show "Admin accounts can't shop" instead of adding the item, and any
cart or saved items left in the browser are cleared.

## Redirects after sign-in

`next` is only accepted if it is a path on this site. Values such as
`//example.com`, `https://example.com` or paths containing a backslash are
ignored (see [redirect.ts](../src/features/auth/lib/redirect.ts)).

## Known limitations

- Payment is real (Stripe Checkout), but orders are still stored in the browser.
  The success page only trusts a session it looks up with the secret key, and
  only after checking that the session belongs to the signed-in customer and
  that Stripe reports `payment_status` as `paid`. What is missing is a server
  record: production should create the order from a
  `checkout.session.completed` webhook, so orders survive a cleared browser and
  can be fulfilled.
- Checkout prices come from the cart in the database, not from the form, but
  stock is not decremented when a payment succeeds. Add that in the webhook
  together with the order row.
- When a guest signs in, their server cart replaces the cart in their browser.
  Items added before signing in are not merged.
- Redirects decided by the layouts (signed-in user on a sign-in page, customer on
  an admin page, stale cookie) are sent as a 200 response containing a streamed
  redirect, not an HTTP 307. The browser follows them immediately and no
  protected data is included. Only the proxy's "no session" redirects are real 307s.
