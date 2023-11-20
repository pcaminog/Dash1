import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, locals, url, platform }) => {
	const token = url.searchParams.get('token');
	try {
		const userId = await platform?.env.tokenEmail.get(token);
		const user = await locals.lucia.getUser(userId);
		await locals.lucia.invalidateAllUserSessions(user.userId);
		await locals.lucia.updateUserAttributes(user.userId, {
			email_verified: Number(true)
		});
		const session = await locals.lucia.createSession({
			userId: user.userId,
			attributes: {}
		});
		locals.lucia.setSession(session);
		return new Response(null, {
			status: 302,
			headers: {
				Location: '/'
			}
		});
	} catch {
		return new Response('Invalid email verification link', {
			status: 400
		});
	}
};
