# Security Policy

## Reporting a vulnerability

Please report privately using GitHub's private vulnerability reporting: open this repository's **Security** tab and choose **Report a vulnerability**. Please do not open a public issue for a suspected vulnerability.

Include what you found, how to reproduce it, and the impact you expect. This is a personal project, so there is no formal response-time guarantee, but reports are read and taken seriously.

## Controls in this repository

- **No backend and no API requests.** The app is a static single-page app. The Content Security Policy in `vercel.json` sets `connect-src 'none'`, which blocks `fetch`, XHR and WebSocket, and allows scripts only from the site's own origin (no inline scripts). The only third-party requests are Google Fonts stylesheets and font files. `test/headers.test.js` checks this.
- **Generated text is escaped.** The print-to-PDF page is built by `src/printDoc.js`, which escapes every interpolated value and contains no script; `test/printDoc.test.js` checks this.
- **The MCP server is local and narrow.** `mcp/` talks over stdio only, serves read-only guitarist data from files in this repository, and accepts only five known guitarist IDs and `lead`/`rhythm`, enforced by zod schemas; `mcp/test/validation.test.js` sends hostile input to the running server.
- **Dependencies and secrets are checked in CI.** `.github/workflows/ci.yml` runs `npm audit` for both packages and a gitleaks secret scan, with actions pinned to commit SHAs, and Dependabot proposes updates weekly.
