import { OAuthRequestError } from '@lucia-auth/oauth';
import { azureAD } from '@lucia-auth/oauth/providers';
import {
	API_URL,
	MICROSOFT_CLIENT_ID,
	MICROSOFT_REDIRECT_URL,
	MICROSOFT_SECRET_VALUE,
	MICROSOFT_TENANT_ID
} from '$env/static/private';

export const GET = async ({ url, cookies, locals }) => {
	const microsoftAuth = azureAD(locals.lucia, {
		clientId: MICROSOFT_CLIENT_ID,
		clientSecret: MICROSOFT_SECRET_VALUE,
		tenant: MICROSOFT_TENANT_ID,
		redirectUri: MICROSOFT_REDIRECT_URL
	});
	const storedState = cookies.get('ad_oauth_state');
	const codeVerifier = cookies.get('ad_oauth_code_verifier');
	const state = url.searchParams.get('state');
	const code = url.searchParams.get('code');

	if (!storedState || !state || storedState !== state || !code) {
		return new Response(null, {
			status: 400
		});
	}

	try {
		const { getExistingUser, azureADUser, createUser } = await microsoftAuth.validateCallback(
			code,
			codeVerifier!
		);
			console.log(azureADUser);
		const getUser = async () => {
			const existingUser = await getExistingUser();
			if (existingUser) return existingUser;
			const user = await createUser({
				attributes: {
					username: azureADUser.name,
					avatar: azureADUser.picture,
					name: azureADUser.given_name,
					email: azureADUser.email
				}
			});
			return user;
		};

		const user = await getUser();

		const session = await locals.lucia.createSession({
			userId: user.userId,
			attributes: {}
		});
		await fetch(`${API_URL}/account/create?user_id=${user.userId}&email=${azureADUser.email}`, {
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
				Location: '/home'
			}
		});
	} catch (e) {
		if (e instanceof OAuthRequestError) {
			return new Response(JSON.stringify(e), {
				status: 400
			});
		}
		return new Response(JSON.stringify(e), {
			status: 500
		});
	}
};
