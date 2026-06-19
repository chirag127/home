# oriz-home

Landing site for the oriz family — `oriz.in`.

- Astro 6 (static output) + React 19 + Tailwind v4
- Firebase Auth (shared `oriz-app` project across all `*.oriz.in` sites)
- Hosted on Cloudflare Pages
- AdSense-ready

## Pages

- `/` — landing
- `/sites/` — every site in the family
- `/about/` — author bio
- `/contact/` — contact form (Web3Forms)
- `/account/` — sign-in via Firebase (Google, GitHub, Email-link, Anonymous)
- `/account/finish-sign-in/` — email-link completion
- `/legal/{privacy,terms,disclaimer,cookies,grievance}/`

## Develop

```bash
pnpm install
npx envpact-cli@0.2.0          # pull shared secrets from envpact vault
pnpm dev                       # http://localhost:4321
```

## Build + deploy

```bash
pnpm build
pnpm deploy                    # wrangler deploy → oriz.in
```
