import { initializeLucia } from '$lib/server/lucia';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const auth = initializeLucia(event.platform?.env.DB);

	event.locals.auth = auth.handleRequest(event);
	if (event.locals?.auth) {
		const Session = await event.locals.auth.validate();
		event.locals.user = Session?.user.userId
	}
	return await resolve(event);
};
