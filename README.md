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
- Full parameter reference: [quanticdata.io/docs](https://quanticdata.io/docs/).

MIT licensed.
