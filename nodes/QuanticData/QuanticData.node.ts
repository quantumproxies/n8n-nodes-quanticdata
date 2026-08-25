import type { INodeType, INodeTypeDescription } from 'n8n-workflow';

export class QuanticData implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'QuanticData',
		name: 'quanticData',
		icon: 'file:quanticdata.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description:
			'Web data through residential proxies: scrape pages to Markdown, SERP search, site map, SEO audit and 74 ready-made collectors',
		defaults: {
			name: 'QuanticData',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'quanticDataApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: 'https://api.quanticdata.io/v1',
			headers: {
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				default: 'scrape',
				options: [
					{
						name: 'Scrape Page',
						value: 'scrape',
						action: 'Scrape a page to Markdown, HTML or text',
						description:
							'Fetch one URL through a residential proxy and return it as clean Markdown, HTML or text',
						routing: {
							request: { method: 'POST', url: '/scraper/extract' },
							output: { postReceive: [{ type: 'rootProperty', properties: { property: 'payload' } }] },
						},
					},
					{
						name: 'Search (SERP)',
						value: 'search',
						action: 'Run a structured web search',
						description: 'Google, Bing or DuckDuckGo results as structured JSON',
						routing: {
							request: { method: 'POST', url: '/scraper/serp' },
							output: { postReceive: [{ type: 'rootProperty', properties: { property: 'payload' } }] },
						},
					},
					{
						name: 'Search and Read',
						value: 'searchAndRead',
						action: 'Search the web and return cited page content',
						description:
							'Search, fetch the top pages as Markdown and return one citation-ready context string',
						routing: {
							request: { method: 'POST', url: '/ai/search' },
							output: { postReceive: [{ type: 'rootProperty', properties: { property: 'payload' } }] },
						},
					},
					{
						name: 'Map Site',
						value: 'map',
						action: 'List the URLs of a site',
						description: 'Discover a site’s URLs fast from sitemaps and homepage links, without a crawl',
						routing: {
							request: { method: 'POST', url: '/scraper/map' },
							output: { postReceive: [{ type: 'rootProperty', properties: { property: 'payload' } }] },
						},
					},
					{
						name: 'SEO Audit',
						value: 'seoAudit',
						action: 'Audit a URL with and without JavaScript',
						description:
							'Fetch a URL as a no-JS bot and fully rendered, and return both views plus the diff',
						routing: {
							request: { method: 'POST', url: '/scraper/seo-audit' },
							output: { postReceive: [{ type: 'rootProperty', properties: { property: 'payload' } }] },
						},
					},
					{
						name: 'Run Collector',
						value: 'runCollector',
						action: 'Run a ready-made collector',
						description:
							'Run one of the 74 ready-made collectors (Amazon, Google Maps, LinkedIn jobs…) with a semantic input, billed per delivered row',
						routing: {
							request: {
								method: 'POST',
								url: '=/scraper/collectors/{{$parameter["slug"]}}/run',
							},
							output: { postReceive: [{ type: 'rootProperty', properties: { property: 'payload' } }] },
						},
					},
				],
			},

			// ── scrape ────────────────────────────────────────────────────────
			{
				displayName: 'URL',
				name: 'url',
				type: 'string',
				required: true,
				default: '',
				placeholder: 'https://example.com',
				displayOptions: { show: { operation: ['scrape', 'map', 'seoAudit'] } },
				routing: { send: { type: 'body', property: 'url' } },
			},
			{
				displayName: 'Format',
				name: 'format',
				type: 'options',
				default: 'markdown',
				options: [
					{ name: 'Markdown', value: 'markdown' },
					{ name: 'HTML', value: 'html' },
					{ name: 'Text', value: 'text' },
				],
				displayOptions: { show: { operation: ['scrape'] } },
				routing: { send: { type: 'body', property: 'format' } },
			},
			{
				displayName: 'Content Mode',
				name: 'contentMode',
				type: 'options',
				default: 'smart',
				description:
					'Smart keeps the whole page minus nav/footer chrome; article extracts the main article only; full returns the entire body',
				options: [
					{ name: 'Smart', value: 'smart' },
					{ name: 'Article', value: 'article' },
					{ name: 'Full', value: 'full' },
				],
				displayOptions: { show: { operation: ['scrape'] } },
				routing: { send: { type: 'body', property: 'content_mode' } },
			},
			{
				displayName: 'Force Browser Render',
				name: 'render',
				type: 'boolean',
				default: false,
				description: 'Whether to force the headless browser (JS execution) instead of the TLS tier',
				displayOptions: { show: { operation: ['scrape'] } },
				routing: { send: { type: 'body', property: 'render' } },
			},

			// ── search / searchAndRead ────────────────────────────────────────
			{
				displayName: 'Query',
				name: 'query',
				type: 'string',
				required: true,
				default: '',
				displayOptions: { show: { operation: ['search', 'searchAndRead'] } },
				routing: { send: { type: 'body', property: 'query' } },
			},
			{
				displayName: 'Engine',
				name: 'engine',
				type: 'options',
				default: 'google',
				options: [
					{ name: 'Google', value: 'google' },
					{ name: 'Bing', value: 'bing' },
					{ name: 'DuckDuckGo', value: 'duckduckgo' },
				],
				displayOptions: { show: { operation: ['search', 'searchAndRead'] } },
				routing: { send: { type: 'body', property: 'engine' } },
			},
			{
				displayName: 'Search Type',
				name: 'searchType',
				type: 'options',
				default: 'search',
				options: [
					{ name: 'Web', value: 'search' },
					{ name: 'News', value: 'news' },
					{ name: 'Images', value: 'images' },
					{ name: 'Videos', value: 'videos' },
					{ name: 'Shopping', value: 'shopping' },
					{ name: 'Maps', value: 'maps' },
					{ name: 'Places', value: 'places' },
					{ name: 'Jobs', value: 'jobs' },
					{ name: 'Scholar', value: 'scholar' },
				],
				displayOptions: { show: { operation: ['search'] } },
				routing: { send: { type: 'body', property: 'search_type' } },
			},
			{
				displayName: 'Results',
				name: 'num',
				type: 'number',
				default: 10,
				description: 'How many organic results to aim for (max 100)',
				displayOptions: { show: { operation: ['search'] } },
				routing: { send: { type: 'body', property: 'num' } },
			},
			{
				displayName: 'Top Pages to Read',
				name: 'topN',
				type: 'number',
				default: 3,
				description: 'How many top organic pages to fetch as Markdown (max 5)',
				displayOptions: { show: { operation: ['searchAndRead'] } },
				routing: { send: { type: 'body', property: 'top_n' } },
			},

			// ── map ───────────────────────────────────────────────────────────
			{
				displayName: 'Filter',
				name: 'search',
				type: 'string',
				default: '',
				placeholder: '/blog',
				description: 'Only return URLs containing this substring',
				displayOptions: { show: { operation: ['map'] } },
				routing: { send: { type: 'body', property: 'search' } },
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				default: 100,
				description: 'Max URLs returned (up to 5000)',
				displayOptions: { show: { operation: ['map'] } },
				routing: { send: { type: 'body', property: 'limit' } },
			},

			// ── seoAudit ──────────────────────────────────────────────────────
			{
				displayName: 'Skip Rendered Pass',
				name: 'noRender',
				type: 'boolean',
				default: false,
				description: 'Whether to return only the cheaper no-JS view, without the rendered diff',
				displayOptions: { show: { operation: ['seoAudit'] } },
				routing: { send: { type: 'body', property: 'no_render' } },
			},

			// ── runCollector ──────────────────────────────────────────────────
			{
				displayName: 'Collector Slug',
				name: 'slug',
				type: 'string',
				required: true,
				default: '',
				placeholder: 'google_maps_places',
				description:
					'Slug from GET /v1/scraper/collectors, e.g. amazon_search, google_maps_places, linkedin_jobs',
				displayOptions: { show: { operation: ['runCollector'] } },
			},
			{
				displayName: 'Input (JSON)',
				name: 'collectorInput',
				type: 'json',
				required: true,
				default: '{\n  "keyword": "dentist",\n  "location": "Austin, TX",\n  "max_results": 20\n}',
				description: 'Fields matching the collector’s input schema',
				displayOptions: { show: { operation: ['runCollector'] } },
				routing: {
					send: {
						type: 'body',
						property: '=',
						value: '={{ JSON.parse($value) }}',
					},
				},
			},

			// ── shared ────────────────────────────────────────────────────────
			{
				displayName: 'Country',
				name: 'country',
				type: 'string',
				default: '',
				placeholder: 'us',
				description: 'ISO country code for the proxy exit / search locale',
				displayOptions: { show: { operation: ['scrape', 'search', 'searchAndRead', 'seoAudit'] } },
				routing: { send: { type: 'body', property: 'country' } },
			},
		],
	};
}
