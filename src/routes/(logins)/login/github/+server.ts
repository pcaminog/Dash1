import { dev } from '$app/environment';
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, GITHUB_REDIRECT } from '$env/static/private';
import { github } from '@lucia-auth/oauth/providers';

export const GET = async ({ cookies, locals, url: query }) => {
	const token = query.searchParams.get('token');

	const githubAuth = github(locals.lucia, {
		clientId: GITHUB_CLIENT_ID,
		clientSecret: GITHUB_CLIENT_SECRET,
		scope: ['user:email'],
		redirectUri: GITHUB_REDIRECT + '?token=' + token
	});

	const [url, state] = await githubAuth.getAuthorizationUrl();
	// store state
	cookies.set('github_oauth_state', state, {
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
