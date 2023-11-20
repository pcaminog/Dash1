import { initializeLucia } from '$lib/server/lucia';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const auth = initializeLucia(event.platform?.env.DB);
	event.locals.auth = auth.handleRequest(event);
	return await resolve(event);
};
