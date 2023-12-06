import { building } from '$app/environment';
import { initializeLucia } from '$lib/server/lucia';
import type { Handle, HandleServerError } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	if (building) {
		const response = await resolve(event);
		return response; // bailing here allows the 404 page to build
	}

	const auth = initializeLucia(event.platform?.env.DB);

	// event.locals.auth = auth.handleRequest(event);
	// event.locals.lucia = auth;
	// const session = {
	// 	user: {
	// 		email: 'pcaminog@outlook.com',
	// 		username: 'pcaminog',
	// 		avatar: 'https://avatars.githubusercontent.com/u/26197615?v=4',
	// 		name: 'Pablo Camino',
	// 		account_id: '1383b8f1-e494-42f4-b220-b41eba7b63c1',
	// 		account_name: 'My Organization',
	// 		account_plan: 'free',
	// 		userId: 'r4v64lrlde9frkz'
	// 	},
	// 	sessionId: 'te9l8yt56xvnmjvgsxahky4odb3ngl9wutuecmes',
	// 	activePeriodExpiresAt: '2023-12-06T14:49:12.752Z',
	// 	idlePeriodExpiresAt: '2023-12-20T14:49:12.752Z',
	// 	state: 'active',
	// 	fresh: false
	// };

	// event.locals.user = session?.user.userId;
	// event.locals.session = session;
	// return await resolve(event);

	event.locals.auth = auth.handleRequest(event);
	event.locals.lucia = auth;
	if (event.locals?.auth) {
		const session = await event.locals.auth.validate();
		console.log(session);
		if (!session) {
			if (!event.url.pathname.startsWith('/login')) {
				return new Response(null, {
					status: 307,
					headers: { location: '/login?hooks_no_session' }
				});
			}
		}
		event.locals.user = session?.user.userId;
		event.locals.session = session;
	}
	return await resolve(event);
};

export const handleError: HandleServerError = ({ error, event }) => {
	// example integration with https://sentry.io/
	const stringError = JSON.stringify(error);

	return {
		message: `Whoops!, ${stringError}`,
		code: error ?? 'UNKNOWN'
	};
};
