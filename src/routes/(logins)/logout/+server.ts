import { redirect } from '@sveltejs/kit';

export const GET = async ({ locals }) => {
	const session = await locals.auth.validate();
	if (!session) {
		locals.auth.setSession(null);
	}
	await locals.lucia.invalidateSession(session?.sessionId); // invalidate session
	locals.auth.setSession(null); // remove cookie
	throw redirect(302, '/login');
};
