import { initializeLucia } from '$lib/server/lucia';
import { redirect, type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const auth = initializeLucia(event.platform?.env.DB);

	event.locals.auth = auth.handleRequest(event);
	event.locals.lucia = auth;
	if (event.locals?.auth) {
		const session = await event.locals.auth.validate();
		if (!session) {
			throw redirect(303, '/login?hooks_no_session');
		}
		event.locals.user = session?.user.userId;
	}
	return await resolve(event);
};
