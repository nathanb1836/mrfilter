# Mister Filter website

Plain HTML, CSS and JavaScript. No build step. Deploys as-is on Vercel.

## Before you launch
1. Run `sh check-placeholders.sh` to see every placeholder still on the site (phone, email, hours, towns, add-on prices, business price, Privacy and Terms pages).
2. Add photos to `assets/photos/` using the file names the script lists. Until a file exists, that photo spot is just a light-blue box.
3. Put your ZIP codes in `site.js` (`window.SERVICE_ZIPS`), separated by commas.

## Make the quote forms email you
In Vercel: Project, Settings, Environment Variables. Add:
- `RESEND_API_KEY` : your key from resend.com
- `LEAD_TO_EMAIL` : where quote requests should arrive (comma-separate several)
- `LEAD_FROM_EMAIL` (optional): an address on a domain you verified in Resend. Without it, Resend's test sender is used, which only works for your own Resend account email.

Then redeploy. Until these are set, the forms show an error instead of pretending to send.

## Files
- `index.html`, `plans.html`, `services.html`, `business.html`, `about.html`, `faq.html`, `quote.html`, `privacy.html`, `terms.html`
- `api/lead.js` : receives form submissions
- `site.js` : menu, ZIP list, form sending
- `assets/` : images
