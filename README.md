# Evergreen Business Consultants website

Website source for https://evergreenconsultants.site/.

## Verified business information
- Public-facing brand: Evergreen Business Consultants.
- Primary contact: Julius Nganga — bensontrucking247@gmail.com.
- No public phone number or office address is listed because neither has been verified for publication.
- Available business records identify the former Washington entity BENSON TRUCKING LLC and describe a proposed reinstatement and legal-name amendment to EVERGREEN BUSINESS CONSULTANTS LLC. The records do not prove that the filing was accepted; the website therefore does not claim that the amendment is effective.
- Public service scope: business planning, management and operations consulting, administrative process improvement, business systems/workflow design, workflow automation advisory, and sales/marketing process support.

## Forms and accounts
The inquiry and onboarding forms validate in the visitor's browser and prepare a message addressed to Julius. The visitor must review and press Send. The site does not currently store form submissions server-side.

The onboarding form is a request for review, not automatic account creation. It does not request or store passwords. A real client login requires a separately implemented and tested authenticated portal/backend.

## Cloudflare deployment status — 2026-11-13
- Worker: `evergreen-business-consultants`
- Account workers.dev preview: https://evergreen-business-consultants.mashie20.workers.dev/
- Custom domain zone: `evergreenconsultants.site` (zone ID `9b4d1f60d92cc13007931995b3cb3823`), currently `pending`.
- Worker routes staged for `evergreenconsultants.site/*` and `www.evergreenconsultants.site/*`.
- Always Use HTTPS is enabled in the staged zone.
- Cloudflare DNS scan imported 27 existing records. Existing Jellyfish MX, SPF, DKIM and DMARC values were retained. cPanel, mail, webmail and related service A records were set to DNS-only.
- Namecheap remains the registrar. The domain's live nameservers have not been changed. Cloudflare assigned `byron.ns.cloudflare.com` and `susan.ns.cloudflare.com`; the zone and custom-domain routes become active only after those nameservers are set at Namecheap and Cloudflare activates the zone.
- The deployed Worker was uploaded through the Cloudflare API from the current GitHub `main` source. A future automated GitHub-to-Cloudflare build/deploy connection has not yet been configured.

Do not replace the existing mail records or change MX providers during cutover. Verify the live site, TLS certificate, MX and mail flow after Cloudflare reports the zone active.
