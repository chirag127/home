// home-app /api/billing-webhook/razorpay — receives Razorpay webhook
// POSTs, verifies HMAC, writes Firestore. Per runbook section 6.
//
// This route MUST be a Pages Function (prerender=false) to receive
// POST requests at runtime.
export { POST } from '@chirag127/astro-billing/api/webhook'
export const prerender = false
