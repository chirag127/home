// home-app /api/billing-create-subscription — re-export from
// @chirag127/astro-billing so the package can evolve without each
// app duplicating the implementation.
//
// See: knowledge/runbooks/razorpay-end-to-end-setup.md section 5.
export { POST } from '@chirag127/astro-billing/api/create-subscription'
export const prerender = false
