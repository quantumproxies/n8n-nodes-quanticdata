# n8n-nodes-quanticdata

n8n community node for the [QuanticData](https://quanticdata.io) API: web data
through residential proxies with pay-per-success billing.

Operations:

- **Scrape Page** — any URL to clean Markdown, HTML or text; smart content
  extraction, optional browser render
- **Search (SERP)** — structured Google, Bing or DuckDuckGo results across
  web, news, images, shopping, maps, jobs and more
- **Search and Read** — search the web and get the top pages back as
  citation-ready Markdown context, sized for an LLM prompt
- **Map Site** — every URL of a site in seconds, from sitemaps and homepage
  links
- **SEO Audit** — a URL fetched as a no-JS bot and fully rendered, with the
  diff
- **Run Collector** — 74 ready-made collectors (Amazon, Google Maps, LinkedIn
  jobs, app stores…) driven by semantic inputs instead of URLs, billed per
  delivered row

## Installation

In n8n: **Settings → Community nodes → Install** and enter
`n8n-nodes-quanticdata`.

Self-hosted via npm:

```bash
npm install n8n-nodes-quanticdata
```

## Credentials

Create a free API key at [quanticdata.io](https://quanticdata.io) — every
account includes free monthly usage, no card required. Add it in n8n as a
**QuanticData API** credential.

## Usage notes

- Failed calls (blocked pages, captchas) are never billed.
- Scrape responses put the page in `content`, with `title`, `engine` and
  `attempts` alongside.
- Search responses use SerpApi-compatible field names under `organic`.
- Full parameter reference: https://quanticdata.io/docs/

MIT licensed.

## Releasing

Every release goes out from GitHub Actions, never from a laptop: since
1 May 2026 n8n only verifies community nodes published with an npm
**provenance** statement, and provenance is signed by the CI's OIDC token —
a local `npm publish` cannot produce one.

1. Bump `version` in `package.json` and commit.
2. `git tag v<version> && git push origin v<version>` (or run the *Publish to
   npm* workflow by hand).
3. The workflow builds, refuses the release if a runtime dependency has crept
   in — verified nodes may not have any — and publishes with
   `npm publish --provenance --access public`.
4. Check the attestation: `npm view n8n-nodes-quanticdata dist.attestations`
   must not be empty, and the npm page shows the green "Provenance" panel.

The one secret it needs is `NPM_TOKEN` (npm → Access Tokens → Granular or
Classic **Automation** token with publish rights on this package).
