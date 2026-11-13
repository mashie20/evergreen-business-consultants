# Evergreen Business Consultants website

Static website source for https://evergreenconsultants.site/.

## Verified content decisions
- Public brand: Evergreen Business Consultants.
- Primary contact: Julius Nganga — bensontrucking247@gmail.com.
- No public phone number or office address is shown because neither was verified for publication.
- Available records concern the former Washington entity BENSON TRUCKING LLC and describe a proposed reinstatement/name amendment to EVERGREEN BUSINESS CONSULTANTS LLC. The records do not prove the filing was accepted, so the site does not claim that the legal name change is effective.
- Public service scope: business planning, management and operations consulting, administrative process improvement, business systems/workflow design, workflow automation advisory, and sales/marketing process support.

## Forms and account registration
The forms validate in the visitor's browser and open the visitor's email application with a pre-addressed message to Julius. The visitor must review and press Send. The website does not currently receive or persist form submissions server-side.

The onboarding form is a request for review, not automatic account creation. It does not request or store passwords. A real client login requires a separately implemented and tested authenticated portal/backend.

## Cloudflare deployment
The connected Cloudflare account currently has no evergreenconsultants.site zone. Do not change nameservers or DNS until the correct zone/account is identified and existing MX, SPF, DKIM, and DMARC records are recorded and preserved. The _headers file provides recommended response security headers for compatible static hosting. Configure custom-domain hosting and HTTPS only after authoritative DNS ownership and mail routing are confirmed.
