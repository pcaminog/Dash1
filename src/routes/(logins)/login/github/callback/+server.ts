import { OAuthRequestError } from '@lucia-auth/oauth';
import { github } from '@lucia-auth/oauth/providers';
import { API_URL, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from '$env/static/private';
import { userAgent } from '$lib/utils.js';
import { LuciaError } from 'lucia';

interface emailsGithub {
	email: string;
	primary: boolean;
	verified: boolean;
	visibility: string | null;
}
let validEmail: string | null;
const getUserEmail = async (token: string) => {
	try {
		const emailGithub = await fetch('https://api.github.com/user/emails', {
			headers: {
				Authorization: `Bearer ${token}`,
				'User-Agent': userAgent
			}
		});
		const JSONResp = await emailGithub.json();
		const validEmailObj = JSONResp.find(
			(emailObj: emailsGithub) => emailObj.verified && emailObj.primary
		);
		if (validEmailObj) {
			validEmail = validEmailObj.email;
		}

		return validEmail;
	} catch (e) {
		console.log(e);
	}
};
export const GET = async ({ url, cookies, locals, platform }) => {
	const githubAuth = github(locals.lucia, {
		clientId: GITHUB_CLIENT_ID,
		clientSecret: GITHUB_CLIENT_SECRET
	});
	const storedState = cookies.get('github_oauth_state');
	const state = url.searchParams.get('state');
	const code = url.searchParams.get('code');

	if (!storedState || !state || storedState !== state || !code) {
		return new Response(null, {
			status: 400
		});
	}
	const { getExistingUser, githubUser, githubTokens, createUser, createKey } =
		await githubAuth.validateCallback(code);
	const email = await getUserEmail(githubTokens.accessToken);
	let account_id: string = '';
	try {
		const getUser = async () => {
			const existingUser = await getExistingUser();
			if (existingUser) return existingUser;

			const user = await createUser({
				attributes: {
					username: githubUser.login,
					avatar: githubUser.avatar_url,
					name: githubUser.name,
					email: email
				}
			});

			return user;
		};

		const user = await getUser();

		const authorizationAPI = await fetch(
			`${API_URL}/account/authorization?user_id=${user.userId}&email=${githubUser.email}`,
			{
				method: 'POST',
				headers: {
					Authorization:
						'Bearer ZGVf1sBBw46sB9l8L0BaEJhJUFT0jY9fm7ztodhgDE3kF3DUyKqK1zgoXBmzXrl1lLYpm059htoWSqYp'
				}
			}
		);
		const { message } = await authorizationAPI.json();

		const updatedUser = await locals.lucia.updateUserAttributes(user.userId, {
			accounts: JSON.stringify(message)
		});

		const session = await locals.lucia.createSession({
			userId: updatedUser.userId,
			attributes: {
				username: githubUser.login,
				avatar: githubUser.avatar_url,
				name: githubUser.name,
				email: email
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
		if (e instanceof LuciaError && e.message === `AUTH_INVALID_USER_ID`) {
		}
		if (e instanceof OAuthRequestError) {
			await platform?.env.tokenEmail.put('error400', JSON.stringify(e));
			return new Response(null, {
				status: 400
			});
		}
		await platform?.env.tokenEmail.put('error500', JSON.stringify(e));
		return new Response(null, {
			status: 500
		});
	}
};
