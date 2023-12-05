import { building } from '$app/environment';
import { initializeLucia } from '$lib/server/lucia';
import type { Handle, HandleServerError } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	if (building) {
		const response = await resolve(event);
		return response; // bailing here allows the 404 page to build
	}

	const auth = initializeLucia(event.platform?.env.DB);

	// const session = {
	// 	user: {
	// 		email: 'pcaminog@outlook.com',
	// 		username: 'pcaminog',
	// 		avatar: 'https://avatars.githubusercontent.com/u/26197615?v=4',
	// 		name: 'Pablo Camino',
	// 		accounts:
	// 			'{"account_id":"210ab1d7-cb14-4140-8832-8fcc31570879","account_name":"My Organization","plan":"free"}',
	// 		userId: 'hn8q6lw117bv97u'
	// 	},
	// 	sessionId: 'm888f8fvag29v0ah3xr8yhhh7wmhoz4evqrxjcrk',
	// 	activePeriodExpiresAt: '2023-12-05T20:24:45.990Z',
	// 	idlePeriodExpiresAt: '2023-12-19T20:24:45.990Z',
	// 	state: 'active',
	// 	fresh: false
	// };

	// event.locals.user = session?.user.userId;
	// event.locals.session = session;
	
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
