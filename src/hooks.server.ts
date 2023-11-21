import { building } from '$app/environment';
import { initializeLucia } from '$lib/server/lucia';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	if (building) {
		const response = await resolve(event);
		return response; // bailing here allows the 404 page to build
	}

	const auth = initializeLucia(event.platform?.env.DB);

	event.locals.auth = auth.handleRequest(event);
	event.locals.lucia = auth;

	if (event.locals?.auth) {
		const session = await event.locals.auth.validate();
		// if (!session) {
		// 	return new Response(null, {
		// 		status: 307,
		// 		headers: { location: '/login?hooks_no_session' }
		// 	});
		// }
		event.locals.user = session?.user.userId;
	}
	return await resolve(event);
};
