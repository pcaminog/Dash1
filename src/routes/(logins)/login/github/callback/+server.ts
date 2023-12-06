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
	const invitationToken = url.searchParams.get('token');

	if (!storedState || !state || storedState !== state || !code) {
		return new Response(null, {
			status: 400
		});
	}
	const account_id = crypto.randomUUID();

	const { getExistingUser, githubUser, githubTokens, createUser } =
		await githubAuth.validateCallback(code);
	const email = await getUserEmail(githubTokens.accessToken);
	try {
		const getUser = async () => {
			const existingUser = await getExistingUser();
			if (existingUser) return existingUser;
			if (invitationToken) {
				const isInvited = await fetch(
					`${API_URL}/account/invite/authorization?token=${invitationToken}`,
					{
						method: 'POST',
						headers: {
							Authorization:
								'Bearer ZGVf1sBBw46sB9l8L0BaEJhJUFT0jY9fm7ztodhgDE3kF3DUyKqK1zgoXBmzXrl1lLYpm059htoWSqYp'
						}
					}
				);

				if (isInvited.ok) {
					const { message } = await isInvited.json();
					const user = await createUser({
						attributes: {
							username: githubUser.login,
							avatar: githubUser.avatar_url,
							name: githubUser.name,
							email: email,
							account_id: message[0].id,
							account_name: message[0].name,
							plan: message[0].plan
						}
					});

					const authorizationAPI = await fetch(
						`${API_URL}/account/invite/authorization?user_id=${user.userId}&email=${email}&account_id=${account_id}`,
						{
							method: 'POST',
							headers: {
								Authorization:
									'Bearer ZGVf1sBBw46sB9l8L0BaEJhJUFT0jY9fm7ztodhgDE3kF3DUyKqK1zgoXBmzXrl1lLYpm059htoWSqYp'
							}
						}
					);
					if (!authorizationAPI.ok) {
						return new Response('API Error', {
							status: 401
						});
					}
					return user;
				}
			}

			const user = await createUser({
				attributes: {
					username: githubUser.login,
					avatar: githubUser.avatar_url,
					name: githubUser.name,
					email: email,
					account_id: account_id,
					account_name: 'My Organization',
					plan: 'free'
				}
			});

			const authorizationAPI = await fetch(
				`${API_URL}/account/new/authorization?user_id=${user.userId}&email=${email}&account_id=${account_id}`,
				{
					method: 'POST',
					headers: {
						Authorization:
							'Bearer ZGVf1sBBw46sB9l8L0BaEJhJUFT0jY9fm7ztodhgDE3kF3DUyKqK1zgoXBmzXrl1lLYpm059htoWSqYp'
					}
				}
			);
			if (!authorizationAPI.ok) {
				return new Response('API Error', {
					status: 401
				});
			}
			return user;
		};

		const user = await getUser();
		const session = await locals.lucia.createSession({
			userId: user.userId,
			attributes: {}
		});

		locals.auth.setSession(session);
		return new Response(null, {
			status: 302,
			headers: {
				Location: `/${account_id}/home`
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
