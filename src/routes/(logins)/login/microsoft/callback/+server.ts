import { OAuthRequestError } from '@lucia-auth/oauth';
import { azureAD } from '@lucia-auth/oauth/providers';
import {
	API_URL,
	MICROSOFT_CLIENT_ID,
	MICROSOFT_SECRET_VALUE,
	MICROSOFT_TENANT_ID
} from '$env/static/private';
import { CloudFog } from 'lucide-svelte';

export const GET = async ({ url, cookies, locals }) => {
	const microsoftAuth = azureAD(locals.lucia, {
		clientId: MICROSOFT_CLIENT_ID,
		clientSecret: MICROSOFT_SECRET_VALUE,
		tenant: MICROSOFT_TENANT_ID,
		redirectUri: 'https://app.mon1tor.com/login/microsoft/callback'
	});
	const storedState = cookies.get('microsoft_oauth_state');
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
			storedState
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
		const createAccount = await fetch(`${API_URL}/create/account?user_id=${user.userId}`);

		locals.auth.setSession(session);
		return new Response(null, {
			status: 302,
			headers: {
				Location: '/home'
			}
		});
	} catch (e) {
		console.log(e);
		if (e instanceof OAuthRequestError) {
			console.log(e);
			return new Response(null, {
				status: 400
			});
		}
		return new Response(null, {
			status: 500
		});
	}
};
