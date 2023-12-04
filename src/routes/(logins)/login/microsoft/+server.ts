import { dev } from '$app/environment';
import { azureAD } from '@lucia-auth/oauth/providers';
import {
	MICROSOFT_CLIENT_ID,
	MICROSOFT_REDIRECT_URL,
	MICROSOFT_SECRET_VALUE,
	MICROSOFT_TENANT_ID
} from '$env/static/private';

export const GET = async ({ cookies, locals }) => {
	const microsoftAuth = azureAD(locals.lucia, {
		clientId: MICROSOFT_CLIENT_ID,
		clientSecret: MICROSOFT_SECRET_VALUE,
		tenant: MICROSOFT_TENANT_ID,
		redirectUri: MICROSOFT_REDIRECT_URL,
		scope: ['user.read.all']
	});

	const [url, codeVerifier, state] = await microsoftAuth.getAuthorizationUrl();
	cookies.set('ad_oauth_state', state, {
		httpOnly: true,
		secure: !dev,
		path: '/',
		maxAge: 60 * 60
	});
	cookies.set('ad_oauth_code_verifier', codeVerifier, {
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
