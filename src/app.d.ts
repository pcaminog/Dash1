// See https://kit.svelte.dev/docs/types#app

import type { KVNamespace } from '@cloudflare/workers-types';

// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			auth: import('lucia').AuthRequest;
			user: string | undefined;
			lucia: import('lucia');
			session: any;
			account_id: string;
			account_name: string;
			plan: string;
		}
		interface Platform {
			env: {
				DB: D1Database;
				tokenEmail: KVNamespace;
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
			username?: string;
			avatar?: string;
			name?: string;
			account_id: string;
			account_name: string;
			plan: string;
		};
		type DatabaseSessionAttributes = {};
	}
}

export {};
