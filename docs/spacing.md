# Spacing

TechNest uses a 4-point spacing system. Every margin, padding and gap is a
multiple of 4px, and the size used says how strongly two things belong
together: the tighter the space, the closer the relationship.

## The scale

| Step | Pixels | Typical use |
| --- | --- | --- |
| `1` | 4px | Icon next to its label, badge inset |
| `2` | 8px | Inline controls, chips, button groups |
| `3` | 12px | Compact cards, list rows, form fields |
| `4` | 16px | Default card padding, related blocks |
| `5` | 20px | Dense feature blocks |
| `6` | 24px | Page gutter, section rhythm, feature card padding |
| `8` | 32px | Detail-page splits, table padding |
| `10` | 40px | Wide media padding |
| `12` | 48px | Major breaks between groups of sections |
| `16` | 64px | Empty states, auth screens |

Anything not on this list (6px, 10px, 14px, 18px) is an accident. If a layout
seems to need one, pick the closest step instead of inventing a value.

## Layout roles

The recurring roles have names, defined in
[src/styles/globals.css](../src/styles/globals.css) and exposed as Tailwind
utilities. Prefer the role when it fits; use the numeric scale for one-offs.

| Utility | Token | Value | Role |
| --- | --- | --- | --- |
| `px-gutter` | `--layout-gutter` | 24px | Space between content and the screen edge |
| `space-y-section` / `my-section` | `--layout-section` | 24px | Space between page sections |
| `space-y-stack` / `gap-stack` | `--layout-stack` | 16px | Related blocks inside one card |
| `p-card` | `--layout-card` | 16px | Standard card padding |
| `p-card-lg` | `--layout-card-lg` | 24px | Feature cards, page headers |
| `gap-inline` | `--layout-inline` | 8px | Inline controls and icons |

`Container` already applies `px-gutter`, so pages never add horizontal padding
of their own. Full-bleed children (carousels, media strips) may use a negative
`-mx-gutter` with matching `px-gutter` to bleed to the edge and back.

## Choosing a level

Smallest space wins for the closest relationships:

1. **Inline (8px)** — an icon and its label, a pair of buttons, a badge and its
   count.
2. **Stack (16px)** — a heading and the paragraph under it, the rows inside a
   card, the fields in a small form.
3. **Card (16px) / card-lg (24px)** — padding inside a surface. Use `p-4` for
   standard cards and `p-6` for the page's feature card (profile identity,
   wallet, hero-adjacent panels).
4. **Section (24px)** — between distinct sections of a page: hero → categories →
   deals → product rows → footer offset.
5. **Major break (48px+)** — between a detail page's main block and its reviews,
   before the fixed bottom navigation, or around an empty state.

Two rules keep the hierarchy readable:

- A block's outer spacing must be larger than its inner spacing. If a card has
  16px padding, the gap between two cards must be at least 16px, and the gap
  between card groups at least 24px.
- Do not mix two levels in the same list. Rows in a list share one gap; sections
  share one rhythm.

## Examples

```tsx
// Page section with the 24px gutter and 24px rhythm.
<section className='my-section'>
  <Container>
    <h2 className='text-lg font-bold'>Recently viewed</h2>
    <ul className='mt-3 flex gap-3 overflow-x-auto'>...</ul>
  </Container>
</section>

// Standard card: 16px padding, 16px between rows.
<article className='rounded-3xl border border-border/80 bg-card p-card shadow-sm'>
  <div className='space-y-stack'>...</div>
</article>

// Feature card: 24px padding.
<section className='rounded-3xl border border-border/80 bg-card p-card-lg shadow-sm'>
  ...
</section>

// Inline controls.
<div className='flex items-center gap-inline'>
  <Icon className='size-4' />
  <span>Saved</span>
</div>
```

## Fixed navigation clearance

The customer app is mobile-first with a bottom navigation bar. Pages that can
scroll under it reserve space with `pb-24` (96px), and `SiteNav` offsets itself
with `mt-24`. These are the only intentional 96px values; do not use them as a
general section size.

## Where the tokens live

- Scale and roles: `src/styles/globals.css`
- Container gutter: `src/shared/components/Container.tsx`
- Numeric utilities (`p-4`, `gap-2`, `mt-6`) map to the same scale through the
  `@theme` block, so mixing a numeric step with a role utility is safe.
