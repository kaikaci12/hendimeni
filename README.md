# ProLink Georgia (Next.js 15, App Router, Tailwind 3)
`npm i && npm run dev` → http://localhost:3000 (redirects to /ka).
- `src/app/[locale]/…` pages (ka/en) · `src/app/api/…` route handlers
- `src/messages/{ka,en}.json` translations · `src/data/` categories, cities, mock handymen
- `src/lib/` i18n + search logic · `src/components/` UI
Setup: cp .env.example .env, create the Postgres DB, `npm i`, `npx prisma migrate dev --name init`, `npm run db:seed`, `npm run dev`.

`npm run db:seed` idempotently creates six example handyman listings. Handyman listings, search results, and profile pages are backed by the database. Browse and filter them at `/{locale}/handymans`; the JSON endpoint is `/api/handymans` (also available at `/api/handymen`). Supported query parameters are `q`, `category`, `sub`, `city`, `minPrice`, `maxPrice`, and `vip`.
