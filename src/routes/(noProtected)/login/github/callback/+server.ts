import { OAuthRequestError } from '@lucia-auth/oauth';
import { github } from '@lucia-auth/oauth/providers';
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from '$env/static/private';

export const GET = async ({ url, cookies, locals }) => {
	const githubAuth = github(locals.lucia, {
		clientId: GITHUB_CLIENT_ID,
		clientSecret: GITHUB_CLIENT_SECRET
	});
	const storedState = cookies.get('github_oauth_state');
	const state = url.searchParams.get('state');
	const code = url.searchParams.get('code');
	console.log(state);
	console.log(code);

	if (!storedState || !state || storedState !== state || !code) {
		return new Response(null, {
			status: 400
		});
	}

	try {
		const { getExistingUser, githubUser, createUser } = await githubAuth.validateCallback(code);
		console.log('githubUser===> ', githubUser);
		console.log('await getExistingUser()  =>', await getExistingUser());
		const getUser = async () => {
			const existingUser = await getExistingUser();
			console.log(existingUser);
			if (existingUser) return existingUser;
			const user = await createUser({
				attributes: {
					username: githubUser.login,
					avatar: githubUser.avatar_url,
					name: githubUser.name
				}
			});
			return user;
		};

		const user = await getUser();
		console.log('user => ', user);

		const session = await locals.lucia.createSession({
			userId: user.userId,
			attributes: {}
		});
		console.log('session ===> ', session);

		locals.auth.setSession(session);
		return new Response(null, {
			status: 302,
			headers: {
				Location: '/home'
			}
		});
	} catch (e) {
		console.log(JSON.stringify(e));
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
