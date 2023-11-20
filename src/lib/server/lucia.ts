import { lucia } from 'lucia';
import { d1 } from '@lucia-auth/adapter-sqlite';
import type { D1Database } from '@cloudflare/workers-types';
import { sveltekit } from 'lucia/middleware';
import { github } from '@lucia-auth/oauth/providers';
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from '$env/static/private';
export const initializeLucia = (db: D1Database) => {
	const auth = lucia({
		env: 'DEV',
		adapter: d1(db, {
			user: 'user',
			key: 'user_key',
			session: 'user_session'
		}),
		middleware: sveltekit(),
        

		// ...
	});

	return auth;
};



export type Auth = ReturnType<typeof initializeLucia>;
