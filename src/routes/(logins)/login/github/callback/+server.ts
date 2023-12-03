import { OAuthRequestError } from '@lucia-auth/oauth';
import { github } from '@lucia-auth/oauth/providers';
import { API_URL, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from '$env/static/private';

interface emailsGithub {
	email: string;
	primary: boolean;
	verified: boolean;
	visibility: string | null;
}
export const GET = async ({ url, cookies, locals }) => {
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

	try {
		const { getExistingUser, githubUser, githubTokens, createUser } =
			await githubAuth.validateCallback(code);
		let validEmail: string | null = githubUser.email;

		const emailGithub = await fetch('https://api.github.com/user/emails', {
			headers: {
				Authorization: `Bearer ${githubTokens.accessToken}`
			}
		});

		const JSONResp = await emailGithub.json();
		const validEmailObj = JSONResp.find(
			(emailObj: emailsGithub) => emailObj.verified && emailObj.primary
		);
		if (validEmailObj) {
			validEmail = validEmailObj.email;
		}

		const getUser = async () => {
			const existingUser = await getExistingUser();
			if (existingUser) return existingUser;

			const user = await createUser({
				attributes: {
					username: githubUser.login,
					avatar: githubUser.avatar_url,
					name: githubUser.name,
					email: validEmail ?? githubUser.email
				}
			});
			await fetch(`${API_URL}/account/create?user_id=${user.userId}&email=${githubUser.email}`, {
				method: 'POST',
				headers: {
					Authorization:
						'Bearer ZGVf1sBBw46sB9l8L0BaEJhJUFT0jY9fm7ztodhgDE3kF3DUyKqK1zgoXBmzXrl1lLYpm059htoWSqYp'
				}
			});
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
				Location: '/home'
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
