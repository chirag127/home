# Oriz Home — Hub

[![GitHub stars](https://img.shields.io/github/stars/chirag127/home?style=social)](https://github.com/chirag127/home/stargazers)

> Landing site for the oriz family — the apex hub that links every `*.oriz.in` site together.

**Live at**: https://oriz.in · **Status**: production

## What this is

The apex of the oriz family. It hosts the brand landing page, the catalogue of every site in the family, and the shared sign-in entry point. Every other `*.oriz.in` domain points back to here as the canonical hub.

## Per-feature inventory

| Feature | Status |
|---|---|
| `/` landing | ✅ live |
| `/sites/` family catalogue | ✅ live |
| `/about/` author bio | ✅ live |
| `/contact/` contact form | ✅ live |
| `/account/` shared sign-in (Google, GitHub, Email-link, Anonymous) | ✅ live |
| `/account/finish-sign-in/` email-link callback | ✅ live |
| `/legal/{privacy,terms,disclaimer,cookies,grievance}/` | ✅ live |
| `/links/`, `/support/` | ✅ live |
| Cross-site `⌘K` MultiSearch | ✅ live |
| StatusBanner (auto from `status.oriz.in`) | ✅ live |

## App-specific env vars

None beyond the family-wide set at `templates/.env.example`.

## Local dev

```bash
# from the workspace root (c:/D/oriz)
pnpm -F @chirag127/oriz-home dev
```

## Knowledge

See [`./knowledge/`](./knowledge/) for app-specific decisions, runbooks, and services. Family rules / decisions / architecture live at the master repo's [`knowledge/`](../../../../knowledge/).

## License

MIT License. See master [`LICENSE`](../../../../LICENSE) — same terms across the family.
