import { OAuthRequestError } from '@lucia-auth/oauth';
import { discord } from '@lucia-auth/oauth/providers';
import {
	API_URL,
	DISCORD_CLIENT_ID,
	DISCORD_CLIENT_SECRET,
	DISCORD_REDIRECT
} from '$env/static/private';

export const GET = async ({ url, cookies, locals }) => {
	const discordAuth = discord(locals.lucia, {
		clientId: DISCORD_CLIENT_ID,
		clientSecret: DISCORD_CLIENT_SECRET,
		redirectUri: DISCORD_REDIRECT
	});
	const storedState = cookies.get('discord_oauth_state');
	const state = url.searchParams.get('state');
	const code = url.searchParams.get('code');

	if (!storedState || !state || storedState !== state || !code) {
		return new Response(null, {
			status: 400
		});
	}
	const account_id = crypto.randomUUID();

	try {
		const { getExistingUser, discordUser, createUser } = await discordAuth.validateCallback(code);
		const getUser = async () => {
			const existingUser = await getExistingUser();
			if (existingUser) return existingUser;
			const user = await createUser({
				attributes: {
					username: discordUser.username,
					avatar: `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.webp`,
					name: discordUser.global_name,
					email: discordUser.email
				}
			});
			return user;
		};

		const user = await getUser();
		const session = await locals.lucia.createSession({
			userId: user.userId,
			attributes: {}
		});
		await fetch(`${API_URL}/account/authorization?user_id=${user.userId}&email=${discordUser.email}`, {
			method: 'POST',
			headers: {
				Authorization:
					'Bearer ZGVf1sBBw46sB9l8L0BaEJhJUFT0jY9fm7ztodhgDE3kF3DUyKqK1zgoXBmzXrl1lLYpm059htoWSqYp'
			}
		});

		locals.auth.setSession(session);
		return new Response(null, {
			status: 302,
			headers: {
				Location: `/${account_id}/home`
			}
		});
	} catch (e) {
		if (e instanceof OAuthRequestError) {
			// invalid code
			return new Response(null, {
				status: 400
			});
		}
		return new Response(null, {
			status: 500
		});
	}
};
