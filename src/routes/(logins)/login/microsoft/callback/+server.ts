import { OAuthRequestError } from '@lucia-auth/oauth';
import { azureAD } from '@lucia-auth/oauth/providers';
import {
	API_URL,
	MICROSOFT_CLIENT_ID,
	MICROSOFT_REDIRECT_URL,
	MICROSOFT_SECRET_VALUE,
	MICROSOFT_TENANT_ID
} from '$env/static/private';
import { userAgent } from '$lib/utils.js';

const getUserEmailAndAvatar = async (token: string) => {
	try {
		const response = await fetch('https://graph.microsoft.com/v1.0/me', {
			headers: {
				Authorization: `Bearer ${token}`,
				'User-Agent': userAgent
			}
		});
		const JSONResp = await response.json();

		// Use the 'mail' field if it's not null, otherwise use 'userPrincipalName'
		let email = JSONResp.mail || JSONResp.userPrincipalName;

		// If 'userPrincipalName' was used and it's not in the correct email format, transform it
		if (!JSONResp.mail && email.includes('#EXT#')) {
			const parts = email.split('#EXT#');
			email = parts[0].replace('_', '@');
		}

		// Fetch the avatar
		// const avatarResponse = await fetch('https://graph.microsoft.com/v1.0/me/photo/$value', {
		// 	headers: {
		// 		Authorization: `Bearer ${token}`,
		// 		'User-Agent': userAgent
		// 	}
		// });

		let avatarUrl = null;
		// if (avatarResponse.ok) {
		// 	const blob = await avatarResponse.blob();
		// 	avatarUrl = URL.createObjectURL(blob);
		// }

		return { email, avatarUrl };
	} catch (e) {
		return { email: '', avatarUrl: '' };
	}
};

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
	const account_id = crypto.randomUUID();

	try {
		const { getExistingUser, azureADUser, azureADTokens, createUser } =
			await microsoftAuth.validateCallback(code, codeVerifier!);
		const getUser = async () => {
			const existingUser = await getExistingUser();
			if (existingUser) return existingUser;
			const { email, avatarUrl } = await getUserEmailAndAvatar(azureADTokens.accessToken);
			const user = await createUser({
				attributes: {
					username: azureADUser.given_name,
					avatar: avatarUrl,
					name: azureADUser.name,
					email: email
				}
			});
			return user;
		};

		const user = await getUser();

		const session = await locals.lucia.createSession({
			userId: user.userId,
			attributes: {}
		});
		await fetch(`${API_URL}/account/authorization?user_id=${user.userId}&email=${azureADUser.email}`, {
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
			return new Response(JSON.stringify(e), {
				status: 400
			});
		}
		return new Response(JSON.stringify(e), {
			status: 500
		});
	}
};
