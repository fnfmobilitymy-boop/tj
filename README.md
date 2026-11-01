# TJ Kuching Car Rental

Malaysia car rental website prototype, inspired by the supplied dark automotive references.

Requires Node.js 24. No package installation or external services are required.

```sh
cd /workspace/tj
npm run dev
```

The server listens on port 3000 (`PORT` overrides it). Run `npm run check` for JavaScript syntax validation.

Features: responsive fleet catalogue, category/budget/passenger filters, price sorting, rental date selection, estimated totals, booking request form and browser-local booking history.

This is a frontend demo. Bookings are stored only in this browser's localStorage and are not sent to an operator. Prices and fleet data are samples. No payment, real availability, authentication or backend is connected. Contact addresses are placeholders. Local car images are style references extracted from the user-supplied video, not photos of the listed vehicles. Replace these with authorised fleet photos and connect a booking service before commercial use.

## GitHub Pages

Push these files, including `.github/workflows/pages.yml`, to the `main` branch of `fnfmobilitymy-boop/tj`. In repository Settings → Pages → Build and deployment, select GitHub Actions. Run the Deploy website to GitHub Pages workflow or push a new commit. After a successful deployment, the expected URL is https://fnfmobilitymy-boop.github.io/tj/ (unless the account or repository has a custom Pages domain). This URL is not live until deployment succeeds.

Static asset paths are relative so the site works under `/tj/`. The workflow uploads only public website files. Contact links temporarily point to the existing official website; phone, exact address, email and a precise map remain pending because access to the official website is blocked by the environment proxy.

## Brand catalogue

`fleet-data.js` contains 27 brands and 118 illustrative Malaysian-market models. Clicking a brand opens its filtered collection; vehicle type, budget, seats, model search and sorting refine it. Brand URLs use `?brand=bmw`, for example. These entries and prices are samples, not evidence of available rental stock. Manufacturer emblems identify brands, while real vehicle photography remains pending. `assets/brands/SOURCE.txt` records emblem provenance.

`npm run build` creates `_site` with content-hashed CSS and JavaScript to prevent stale asset mixing on Pages. The deployment workflow uses this output.
