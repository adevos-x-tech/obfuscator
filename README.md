# Adevos-X Tech Obfuscator

A client-side JavaScript obfuscation tool. Source code is processed entirely
in the browser and is never uploaded to a server.

## Monorepo layout

```
adevos-x-tech-obfuscator/
  apps/
    web/   Next.js frontend (deploy to Vercel)
    api/   Express backend (deploy to Heroku or a Pterodactyl Panel)
```

## Frontend (apps/web)

Stack: Next.js 14, React 18, TypeScript, Tailwind CSS, Monaco Editor,
javascript-obfuscator, lucide-react icons.

Features:
- Split-screen Monaco editor (source on the left, obfuscated output on the right)
- Presets: Low / Medium / High / Extreme, plus project presets for Node.js
  backends, React frontends, and Telegram/WhatsApp bots
- Granular controls: string array encoding (Base64/RC4/Hex), control flow
  flattening, dead code injection, identifier renaming, domain lock,
  disable console output, self-defending output, anti-debugging
- Time bomb: optional expiration date after which the obfuscated code refuses
  to run
- Custom header / watermark, with default branding or a user-supplied name
- Regex-based security analyzer that flags exposed database URIs, bot
  tokens, API keys, and private keys before you share your code -- this scan
  also runs entirely client-side
- Side-by-side size/time comparison after each run
- Copy-to-clipboard and download-as-file for the output
- Responsive layout with a hamburger sidebar menu on mobile and a fixed
  sidebar on desktop, including a "Join us" section with WhatsApp and
  Telegram links

### Local setup

```bash
cd apps/web
cp .env.example .env.local
npm install
npm run dev
```

### Environment variables (apps/web/.env.local)

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | Base URL of the deployed backend API |
| `NEXT_PUBLIC_WHATSAPP_URL` | WhatsApp link shown in the sidebar "Join us" section |
| `NEXT_PUBLIC_TELEGRAM_URL` | Telegram link shown in the sidebar "Join us" section |
| `NEXT_PUBLIC_BRAND_NAME` | Brand name used in the default watermark |

Deploy on Vercel by importing the repo and setting the root directory to
`apps/web` (or use the included `vercel.json` from the repo root), then add
the environment variables above in the Vercel project settings.

## Backend (apps/api)

Stack: Node.js, Express. Currently exposes a health-check endpoint and is
structured so account/history features (referenced by the Vault view in the
frontend) can be added later without a rewrite.

### Local setup

```bash
cd apps/api
cp .env.example .env
npm install
npm run dev
```

### Environment variables (apps/api/.env)

| Variable | Purpose |
|---|---|
| `PORT` | Port to listen on (Heroku/Pterodactyl usually set this for you) |
| `ALLOWED_ORIGINS` | Comma-separated list of origins allowed to call the API |
| `DATABASE_URL` | Reserved for future account/history storage |
| `JWT_SECRET` | Reserved for future authentication |

### Deploying to Heroku

```bash
cd apps/api
heroku create your-app-name
heroku config:set ALLOWED_ORIGINS=https://your-frontend.vercel.app
git subtree push --prefix apps/api heroku main
```

The included `Procfile` starts the server with `node index.js`.

### Deploying to a Pterodactyl Panel

Use a Node.js egg, set the startup command to `node index.js`, and set
`PORT`, `ALLOWED_ORIGINS`, and any other variables above in the panel's
environment variable editor.

## Security notes

- No API keys, tokens, or database URIs are hard-coded anywhere in this
  codebase; all of them are read from environment variables via
  `process.env` on the backend and `NEXT_PUBLIC_*` variables on the frontend.
- Never commit a real `.env` or `.env.local` file. Only the `.env.example`
  files are meant to be committed.
- The obfuscator and the security analyzer both run client-side, so a
  user's source code never has to leave their browser to use this tool.

