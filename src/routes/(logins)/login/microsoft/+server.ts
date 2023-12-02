import { dev } from '$app/environment';
import { azureAD } from '@lucia-auth/oauth/providers';
import {
	MICROSOFT_CLIENT_ID,
	MICROSOFT_SECRET_VALUE,
	MICROSOFT_TENANT_ID
} from '$env/static/private';

export const GET = async ({ cookies, locals }) => {
	const microsoftAuth = azureAD(locals.lucia, {
		clientId: MICROSOFT_CLIENT_ID,
		clientSecret: MICROSOFT_SECRET_VALUE,
		tenant: MICROSOFT_TENANT_ID,
		redirectUri: 'https://app.mon1tor.com/login/microsoft/callback'
	});

	const [url, state, codeVerifier] = await microsoftAuth.getAuthorizationUrl();
	// store state
	cookies.set('microsoft_oauth_state', codeVerifier, {
		httpOnly: true,
		secure: !dev,
		path: '/',
		maxAge: 60 * 60
	});
	return new Response(null, {
		status: 302,
		headers: {
			Location: url.toString()
		}
	});
};
