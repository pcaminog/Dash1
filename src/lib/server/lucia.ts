import { lucia } from 'lucia';
import { d1 } from '@lucia-auth/adapter-sqlite';
import type { D1Database } from '@cloudflare/workers-types';
import { sveltekit } from 'lucia/middleware';
export const initializeLucia = (db: D1Database) => {
	const auth = lucia({
		env: 'DEV',
		adapter: d1(db, {
			user: 'user',
			key: 'user_key',
			session: 'user_session'
		}),
		middleware: sveltekit(),
		getUserAttributes: (databaseUser) => {
			return {
				email: databaseUser.email,
				username: databaseUser.username,
				avatar: databaseUser.avatar,
				name: databaseUser.name,
				account_id: databaseUser.account_id,
				account_name: databaseUser.account_name,
				account_plan: databaseUser.plan
			};
		}

		// ...
	});

	return auth;
};

export type Auth = ReturnType<typeof initializeLucia>;
