# laureldd

## Building the site

- **Nav and header** come from `partials/header.html`. After editing it, **save the file** and run:
  - `npm run build:pages` — updates `index.html`, `furniture.html`, `interiors.html`, and `product-template.html`.
  - `npm run build` — same as above, then regenerates all product pages (requires Supabase env vars).
- **Head** (title, meta, CSS) comes from `partials/head.html`; same build steps apply.

## Checkout emails

When a customer clicks **Proceed to Checkout** and submits the form (name, email, phone, message), the site posts to the built-in **Netlify Forms** endpoint using a hidden form named `truck-checkout`. Netlify then emails you the submission.

To adjust notifications, go to your site in the Netlify dashboard → **Forms** → `truck-checkout` and configure email notifications or integrations there. Each submission includes an `order_summary` field with the full order (products and totals).