import { lucia } from 'lucia';
import { d1 } from '@lucia-auth/adapter-sqlite';
import type { D1Database } from '@cloudflare/workers-types';

export const initializeLucia = (db: D1Database) => {
	const auth = lucia({
		env: 'DEV',
		adapter: d1(db, {
			user: 'user',
			key: 'user_key',
			session: 'user_session'
		})
		// ...
	});
	return auth;
};

export type Auth = ReturnType<typeof initializeLucia>;
