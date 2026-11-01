# TJ Kuching Car Rental

Responsive navy, white and champagne-gold car rental and travel enquiry website.

## Run

Requires Node.js 24; there are no npm dependencies.

```sh
npm run dev
npm run check
npm run build
```

Development server: port 3000 (`PORT` overrides it). The build produces `_site` with content-hashed CSS and JavaScript to prevent mixed cached versions.

## Features

- Bilingual English / Simplified Chinese interface, with browser-saved language preference.
- Opening logo animation, two-video hero carousel, reversible pinned hero transition, and gold/blue Canvas particle morphing between TJ mark, a car silhouette and a sphere.
- Opposing brand reels with hover pause, mouse drag, keyboard navigation, explicit pause and an expandable grid.
- 27-brand, 118-model sample catalogue with brand URLs, search, type/budget/seats filtering and sorting.
- Kuching trip enquiry ideas, chauffeur enquiries, Sabah rental enquiries, original travel guides and booking information.
- Enquiry form, editable review, browser-local drafts, delete confirmation, WhatsApp/email handoff, and My Order.
- TJ's verified public phone/email/address, Google Maps search link and embed.
- Facebook, TikTok, Instagram and YouTube icons only; profile links have not been supplied.
- Reduced-motion alternatives and pause controls. Video and particle rendering stop when offscreen or hidden.

## Booking and catalogue limits

This is an enquiry website, not a live reservation or payment backend. The browser stores drafts under `tj-requests`. Users must explicitly send the prepared WhatsApp message or email; the site cannot verify sending or confirmation. No payment is collected. Final availability, service coverage, prices and terms must be confirmed by TJ.

Vehicle entries and rental prices in `fleet-data.js` are examples, not proof of available rental stock. Vehicle photography is pending; manufacturer emblems identify sample models. Kuching itineraries are original suggested ideas, not copied or confirmed commercial tours. Sabah is an enquiry destination, not a confirmed operating location. Booking information does not invent deposit or cancellation rules.

Contact information was read from https://www.tjkuchingcarrental.com/: +60168689517 (Tomasz), tjkuchingcarrental@gmail.com, Lot L1, Domestic Arrival Hall, Gate 1, Kuching International Airport, 93722 Kuching, Sarawak. The official website lists daily hours of 8:30 am–10 pm. The reference navigation informed feature categories only; no competitor contacts or package prices are used.

Brand emblem provenance: `assets/brands/SOURCE.txt`. Social icon licence: `assets/social/LICENSE.txt`. Local video assets came from the user's uploads. The requested Horizon Drift typeface has not been embedded because no font file has been supplied.

## GitHub Pages

The workflow `.github/workflows/pages.yml` builds and deploys `_site` on pushes to `main`, or via Run workflow. Pages is configured to use GitHub Actions. Website: https://fnfmobilitymy-boop.github.io/tj/.

## Demo travel content

The primary navigation has seven items: Kuching car rental, Kuching holiday packages, private charter, blog, Sabah car rental, Sabah private charter and Sabah holiday packages. My Order is a header utility; terms remain in the footer.

The Demo includes six original sample itineraries and six destination descriptions, plus AI-generated illustrative destination visuals in `assets/borneo-demo-destinations.png`. These are visibly marked as Demo illustrations and are not photographs of confirmed tours. Detailed routes, attraction access, wildlife sightings, accommodation, tickets and partner arrangements are not guaranteed. Requests are quotations only. The fixed WhatsApp entry links to TJ's verified public number.
