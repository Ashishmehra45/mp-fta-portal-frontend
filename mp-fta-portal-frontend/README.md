# Free Trade Agreement Portal — Madhya Pradesh (Website / Frontend)

React + Vite + TypeScript + Tailwind CSS single-page website.

## Run on your computer
1. Install Node.js 18 or newer.
2. `npm install`
3. `npm run dev` → open http://localhost:8080

## Put it on your domain
1. `npm run build` — creates the `dist/` folder.
2. Upload everything inside `dist/` to your web host.
3. Send all unknown paths to `index.html` (single-page app):
   - Nginx: `location / { try_files $uri /index.html; }`
   - Apache: `FallbackResource /index.html`
   - Vercel / Netlify: add a rewrite of `/*` to `/index.html`.

## Settings (`.env`)
| Name | What it is |
|---|---|
| `VITE_SUPABASE_URL` | Address of the backend (database + server functions) |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Public key of that backend |
| `VITE_SUPABASE_PROJECT_ID` | Backend project id |

The included `.env` points at the backend the portal uses today, so the site works straight away.
If you set up your own backend (see the separate **backend** package), replace these three values and rebuild.

## What's inside
- `src/` — all pages and components
- `src/config/` — branding, menu modules, MP Vyapar Setu text
- `src/data/` — reference data (agreements, ODOP, product master, glossary, export statistics)
- `public/media/` — all logos, photos, the homepage video and agreement PDFs (served from your own domain)
- `scripts/` — Python scripts that regenerate the product master and Rules of Origin glossary data files
