import { dev } from '$app/environment';
import { DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, DISCORD_REDIRECT } from '$env/static/private';
import { discord } from '@lucia-auth/oauth/providers';

export const GET = async ({ cookies, locals }) => {
	const discordAuth = discord(locals.lucia, {
		clientId: DISCORD_CLIENT_ID,
		clientSecret: DISCORD_CLIENT_SECRET,
		redirectUri: DISCORD_REDIRECT,
		scope: ['identify', 'email']
	});

	const [url, state] = await discordAuth.getAuthorizationUrl();
	// store state
	cookies.set('discord_oauth_state', state, {
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
