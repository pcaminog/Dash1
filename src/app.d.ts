// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			auth: import('lucia').AuthRequest;
			user: string | undefined;
			lucia: import('lucia');
		}
		interface Platform {
			env: {
				tokenEmail: KVNamespace;
				DB: D1Database;
			};
			context: {
				waitUntil(promise: Promise<any>): void;
			};
			caches: CacheStorage & { default: Cache };
		}
	}
}

/// <reference types="lucia" />
declare global {
	namespace Lucia {
		type Auth = import('$lib/server/lucia').Auth;
		type DatabaseUserAttributes = {
			email: string;
			email_verified: number;
			username?: string;
			avatar?: string;
			name?: string;
		};
		type DatabaseSessionAttributes = {};
	}
}

export {};
