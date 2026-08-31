import type { INodeType, INodeTypeDescription } from 'n8n-workflow';

// Ogni operazione è dichiarativa (routing, niente execute): la request parte
// com'è descritta qui e la risposta torna dal solo `payload` dell'envelope.
const PAYLOAD_OUT = {
	output: { postReceive: [{ type: 'rootProperty' as const, properties: { property: 'payload' } }] },
};

export class QuanticData implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'QuanticData',
		name: 'quanticData',
		icon: 'file:quanticdata.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description:
			'Web data through residential proxies: scrape, SERP, crawl, batch, datasets, parser presets and 78 ready-made collectors — full parity with the MCP server and the Python SDK',
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
						name: 'Batch Scrape',
						value: 'batch',
						action: 'Scrape a list of urls as one async job',
						description: 'Submit up to hundreds of URLs; returns a job ID to poll with Batch Status',
						routing: { request: { method: 'POST', url: '/scraper/batch' }, ...PAYLOAD_OUT },
					},
					{
						name: 'Batch Status',
						value: 'batchStatus',
						action: 'Read a batch job status and results',
						description: 'Status and, when done, the scraped pages of a batch job',
						routing: { request: { method: 'GET', url: '=/scraper/batch/{{$parameter["jobId"]}}' }, ...PAYLOAD_OUT },
					},
					{
						name: 'Collector Run Status',
						value: 'collectorRunStatus',
						action: 'Read an async collector run',
						description: 'Status and rows of a collector run started asynchronously',
						routing: {
							request: { method: 'GET', url: '=/scraper/collectors/runs/{{$parameter["runId"]}}' },
							...PAYLOAD_OUT,
						},
					},
					{
						name: 'Crawl Site',
						value: 'crawl',
						action: 'Crawl a site and extract every page',
						description: 'Follow links from a start URL (async job — poll with Crawl Status)',
						routing: { request: { method: 'POST', url: '/scraper/crawl' }, ...PAYLOAD_OUT },
					},
					{
						name: 'Crawl Status',
						value: 'crawlStatus',
						action: 'Read a crawl job status and pages',
						description: 'Status and, when done, the crawled pages',
						routing: { request: { method: 'GET', url: '=/scraper/crawl/{{$parameter["jobId"]}}' }, ...PAYLOAD_OUT },
					},
					{
						name: 'Create Dataset',
						value: 'createDataset',
						action: 'Describe a table and let the AI build it',
						description: 'The AI dataset builder fills a table from your description, billed per delivered row',
						routing: { request: { method: 'POST', url: '/scraper/datasets' }, ...PAYLOAD_OUT },
					},
					{
						name: 'Dataset Status',
						value: 'datasetStatus',
						action: 'Read a dataset job',
						description: 'Status, row count and schema of a dataset job',
						routing: { request: { method: 'GET', url: '=/scraper/datasets/{{$parameter["jobId"]}}' }, ...PAYLOAD_OUT },
					},
					{
						name: 'Generate Parser',
						value: 'generateParser',
						action: 'Generate a reusable extraction schema',
						description: 'One AI pass on a page layout; replaying the schema on matching pages is free',
						routing: { request: { method: 'POST', url: '/scraper/parser/generate' }, ...PAYLOAD_OUT },
					},
					{
						name: 'Generate Proxies',
						value: 'generateProxies',
						action: 'Generate a proxy list',
						description: 'Build a proxy list for one of your plans (format, count, targeting)',
						routing: { request: { method: 'POST', url: '/public/proxies/generate' }, ...PAYLOAD_OUT },
					},
					{
						name: 'Heal Parser Preset',
						value: 'healParserPreset',
						action: 'Self-heal a parser preset',
						description: 'Regenerate a saved schema against a changed page layout',
						routing: {
							request: { method: 'POST', url: '=/scraper/parser/presets/{{$parameter["presetId"]}}/heal' },
							...PAYLOAD_OUT,
						},
					},
					{
						name: 'List Collectors',
						value: 'listCollectors',
						action: 'List the ready-made collectors',
						description: 'All 78 collectors with input/output schema, price and health',
						routing: { request: { method: 'GET', url: '/scraper/collectors' }, ...PAYLOAD_OUT },
					},
					{
						name: 'List Parser Presets',
						value: 'listParserPresets',
						action: 'List saved parser presets',
						description: 'Your reusable extraction schemas',
						routing: { request: { method: 'GET', url: '/scraper/parser/presets' }, ...PAYLOAD_OUT },
					},
					{
						name: 'List Proxies',
						value: 'listProxies',
						action: 'List your proxy plans',
						description: 'Active proxy plans with type, remaining traffic and expiry',
						routing: { request: { method: 'GET', url: '/public/proxies' }, ...PAYLOAD_OUT },
					},
					{
						name: 'Map Site',
						value: 'map',
						action: 'List the URLs of a site',
						description: 'Discover a site’s URLs fast from sitemaps and homepage links, without a crawl',
						routing: { request: { method: 'POST', url: '/scraper/map' }, ...PAYLOAD_OUT },
					},
					{
						name: 'Parser Preset Stats',
						value: 'parserPresetStats',
						action: 'Read usage stats of a parser preset',
						description: 'Replays, success rate and last use of a saved schema',
						routing: {
							request: { method: 'GET', url: '=/scraper/parser/presets/{{$parameter["presetId"]}}/stats' },
							...PAYLOAD_OUT,
						},
					},
					{
						name: 'Proxy Targeting Options',
						value: 'proxyLocations',
						action: 'List targeting options for a proxy plan',
						description: 'Countries/regions available for the chosen plan type',
						routing: {
							request: { method: 'GET', url: '=/public/generator/{{$parameter["proxyPlan"]}}/targeting-options' },
							...PAYLOAD_OUT,
						},
					},
					{
						name: 'Run Collector',
						value: 'runCollector',
						action: 'Run a ready-made collector',
						description:
							'Run one of the 78 ready-made collectors (Amazon, Google Maps, Trustpilot, Reddit…) with a semantic input, billed per delivered row',
						routing: {
							request: {
								method: 'POST',
								url: '=/scraper/collectors/{{$parameter["slug"]}}/run',
							},
							...PAYLOAD_OUT,
						},
					},
					{
						name: 'Save Parser Preset',
						value: 'saveParserPreset',
						action: 'Save a parser schema as a preset',
						description: 'Store a generated schema for free replays and self-healing',
						routing: { request: { method: 'POST', url: '/scraper/parser/presets' }, ...PAYLOAD_OUT },
					},
					{
						name: 'Scrape Page',
						value: 'scrape',
						action: 'Scrape a page to Markdown, HTML or text',
						description:
							'Fetch one URL through a residential proxy and return it as clean Markdown, HTML or text',
						routing: { request: { method: 'POST', url: '/scraper/extract' }, ...PAYLOAD_OUT },
					},
					{
						name: 'Search (SERP)',
						value: 'search',
						action: 'Run a structured web search',
						description: 'Google, Bing or DuckDuckGo results as structured JSON',
						routing: { request: { method: 'POST', url: '/scraper/serp' }, ...PAYLOAD_OUT },
					},
					{
						name: 'Search and Read',
						value: 'searchAndRead',
						action: 'Search the web and return cited page content',
						description:
							'Search, fetch the top pages as Markdown and return one citation-ready context string',
						routing: { request: { method: 'POST', url: '/ai/search' }, ...PAYLOAD_OUT },
					},
					{
						name: 'Search Bulk',
						value: 'searchBulk',
						action: 'Run many SERP queries as one async job',
						description: 'Submit a list of queries; returns a job ID to poll with Search Bulk Status',
						routing: { request: { method: 'POST', url: '/scraper/serp/bulk' }, ...PAYLOAD_OUT },
					},
					{
						name: 'Search Bulk Status',
						value: 'searchBulkStatus',
						action: 'Read a SERP bulk job',
						description: 'Status and, when done, every query’s results',
						routing: {
							request: { method: 'GET', url: '=/scraper/serp/bulk/{{$parameter["jobId"]}}' },
							...PAYLOAD_OUT,
						},
					},
					{
						name: 'SEO Audit',
						value: 'seoAudit',
						action: 'Audit a URL with and without JavaScript',
						description:
							'Fetch a URL as a no-JS bot and fully rendered, and return both views plus the diff',
						routing: { request: { method: 'POST', url: '/scraper/seo-audit' }, ...PAYLOAD_OUT },
					},
					{
						name: 'Whitelist IP',
						value: 'whitelistIp',
						action: 'Whitelist an IP for proxy auth',
						description: 'Allow an IP to use your proxies without user:pass',
						routing: { request: { method: 'POST', url: '/public/proxies/whitelist-ip' }, ...PAYLOAD_OUT },
					},
				],
			},

			// ── scrape / crawl / map / seoAudit / generateParser ──────────────
			{
				displayName: 'URL',
				name: 'url',
				type: 'string',
				required: true,
				default: '',
				placeholder: 'https://example.com',
				displayOptions: { show: { operation: ['scrape', 'map', 'seoAudit', 'crawl', 'generateParser'] } },
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

			// ── search / searchAndRead / searchBulk ───────────────────────────
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
				displayOptions: { show: { operation: ['search', 'searchAndRead', 'searchBulk'] } },
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
					{ name: 'Trends', value: 'trends' },
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
			{
				displayName: 'Queries (One Per Line)',
				name: 'bulkQueries',
				type: 'string',
				typeOptions: { rows: 4 },
				required: true,
				default: '',
				placeholder: 'web scraping api\nserp api pricing',
				displayOptions: { show: { operation: ['searchBulk'] } },
				routing: {
					send: {
						type: 'body',
						property: 'queries',
						value: '={{ $value.split("\\n").map(q => q.trim()).filter(Boolean).map(q => ({ query: q })) }}',
					},
				},
			},

			// ── crawl / map / batch ───────────────────────────────────────────
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
				description: 'Max URLs (map, up to 5000) or pages (crawl)',
				displayOptions: { show: { operation: ['map', 'crawl'] } },
				routing: { send: { type: 'body', property: 'limit' } },
			},
			{
				displayName: 'URLs (One Per Line)',
				name: 'batchUrls',
				type: 'string',
				typeOptions: { rows: 4 },
				required: true,
				default: '',
				placeholder: 'https://example.com/a\nhttps://example.com/b',
				displayOptions: { show: { operation: ['batch'] } },
				routing: {
					send: {
						type: 'body',
						property: 'urls',
						value: '={{ $value.split("\\n").map(u => u.trim()).filter(Boolean) }}',
					},
				},
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

			// ── datasets ──────────────────────────────────────────────────────
			{
				displayName: 'Dataset Request',
				name: 'datasetRequest',
				type: 'string',
				typeOptions: { rows: 3 },
				required: true,
				default: '',
				placeholder: 'All SaaS companies in Italy with a public pricing page: name, domain, starting price',
				description: 'Describe the table you need — the AI proposes a schema and fills the rows',
				displayOptions: { show: { operation: ['createDataset'] } },
				routing: { send: { type: 'body', property: 'request' } },
			},
			{
				displayName: 'Max Rows',
				name: 'maxRows',
				type: 'number',
				default: 100,
				displayOptions: { show: { operation: ['createDataset'] } },
				routing: { send: { type: 'body', property: 'max_rows' } },
			},

			// ── parser ────────────────────────────────────────────────────────
			{
				displayName: 'Instructions',
				name: 'instructions',
				type: 'string',
				default: '',
				placeholder: 'Extract title, price and availability',
				displayOptions: { show: { operation: ['generateParser'] } },
				routing: { send: { type: 'body', property: 'instructions' } },
			},
			{
				displayName: 'Preset Name',
				name: 'presetName',
				type: 'string',
				required: true,
				default: '',
				displayOptions: { show: { operation: ['saveParserPreset'] } },
				routing: { send: { type: 'body', property: 'name' } },
			},
			{
				displayName: 'Schema (JSON)',
				name: 'presetSchema',
				type: 'json',
				required: true,
				default: '{}',
				description: 'The schema returned by Generate Parser',
				displayOptions: { show: { operation: ['saveParserPreset'] } },
				routing: { send: { type: 'body', property: 'schema', value: '={{ JSON.parse($value) }}' } },
			},
			{
				displayName: 'Preset ID',
				name: 'presetId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: { show: { operation: ['healParserPreset', 'parserPresetStats'] } },
			},

			// ── job / run ids ─────────────────────────────────────────────────
			{
				displayName: 'Job ID',
				name: 'jobId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: { show: { operation: ['crawlStatus', 'batchStatus', 'searchBulkStatus', 'datasetStatus'] } },
			},
			{
				displayName: 'Run ID',
				name: 'runId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: { show: { operation: ['collectorRunStatus'] } },
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
					'Slug from GET /v1/scraper/collectors, e.g. amazon_search, google_maps_places, trustpilot_reviews',
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

			// ── proxies ───────────────────────────────────────────────────────
			{
				displayName: 'Plan Type',
				name: 'proxyPlan',
				type: 'options',
				default: 'residential-premium',
				options: [
					{ name: 'Residential Premium', value: 'residential-premium' },
					{ name: 'Datacenter', value: 'datacenter' },
					{ name: 'Mobile', value: 'mobile' },
				],
				displayOptions: { show: { operation: ['proxyLocations'] } },
			},
			{
				displayName: 'Generator Options (JSON)',
				name: 'generatorInput',
				type: 'json',
				required: true,
				default: '{\n  "count": 10,\n  "country": "us",\n  "format": "user:pass@host:port"\n}',
				description: 'Options for the proxy list generator, matching your plan',
				displayOptions: { show: { operation: ['generateProxies'] } },
				routing: {
					send: {
						type: 'body',
						property: '=',
						value: '={{ JSON.parse($value) }}',
					},
				},
			},
			{
				displayName: 'IP Address',
				name: 'ip',
				type: 'string',
				required: true,
				default: '',
				placeholder: '203.0.113.7',
				displayOptions: { show: { operation: ['whitelistIp'] } },
				routing: { send: { type: 'body', property: 'ip' } },
			},

			// ── shared ────────────────────────────────────────────────────────
			{
				displayName: 'Country',
				name: 'country',
				type: 'string',
				default: '',
				placeholder: 'us',
				description: 'ISO country code for the proxy exit / search locale',
				displayOptions: {
					show: { operation: ['scrape', 'search', 'searchAndRead', 'seoAudit', 'crawl', 'searchBulk'] },
				},
				routing: { send: { type: 'body', property: 'country' } },
			},
		],
	};
}
