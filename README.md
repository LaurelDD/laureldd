# laureldd

## Checkout emails

When a customer clicks **Proceed to Checkout** and submits the form (name, email, phone, message), the site posts to the built-in **Netlify Forms** endpoint using a hidden form named `truck-checkout`. Netlify then emails you the submission.

To adjust notifications, go to your site in the Netlify dashboard → **Forms** → `truck-checkout` and configure email notifications or integrations there. Each submission includes an `order_summary` field with the full order (products and totals).