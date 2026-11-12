# Auth Starter (Next.js + NextAuth + Prisma + Postgres)

Routes: /login /register /forgot-password /reset-password /home (protected)

## Local setup
1. `npm install`
2. `cp .env.example .env` and fill values (see below)
3. `npx prisma db push`   (creates tables)
4. `npm run dev` -> http://localhost:3000

## Env values
- DATABASE_URL: free Postgres from neon.tech (copy connection string)
- NEXTAUTH_SECRET: `openssl rand -base64 32`
- GOOGLE_CLIENT_ID/SECRET: Google Cloud Console > APIs & Services > Credentials > Create OAuth client ID (Web).
  Authorized redirect URIs:
  - http://localhost:3000/api/auth/callback/google
  - https://YOUR-APP.vercel.app/api/auth/callback/google
- RESEND_API_KEY: resend.com (optional locally; reset link prints in terminal)

## Deploy on Vercel
Push to GitHub > Import in Vercel > add ALL env vars (NEXTAUTH_URL = your vercel URL) > Deploy.
Run `npx prisma db push` once locally with the production DATABASE_URL.

## Add to a bigger site
Copy: app/api/*, lib/*, components/*, prisma/*, middleware.js, login/register/forgot/reset pages.
Protect any route by adding it to `matcher` in middleware.js.
