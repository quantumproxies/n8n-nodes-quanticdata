import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class QuanticDataApi implements ICredentialType {
	name = 'quanticDataApi';

	displayName = 'QuanticData API';

	documentationUrl = 'https://quanticdata.io/docs/';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description:
				'Your qd_live_ key from quanticdata.io — every account includes free monthly usage',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.quanticdata.io/v1',
			url: '/scraper/collectors',
		},
	};
}
