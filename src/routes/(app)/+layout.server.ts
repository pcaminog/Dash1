import { dev } from '$app/environment';
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals, url }) => {
	// const session = await locals.auth.validate();
	if (dev) {
		const session = {
			user: {
				email: 'pcaminog@outlook.com',
				username: 'pcaminog',
				avatar: 'https://avatars.githubusercontent.com/u/26197615?v=4',
				name: 'Pablo Camino',
				account_id: '1383b8f1-e494-42f4-b220-b41eba7b63c1',
				account_name: 'My Organization',
				account_plan: 'free',
				userId: 'r4v64lrlde9frkz'
			},
			sessionId: 'te9l8yt56xvnmjvgsxahky4odb3ngl9wutuecmes',
			activePeriodExpiresAt: '2023-12-06T14:49:12.752Z',
			idlePeriodExpiresAt: '2023-12-20T14:49:12.752Z',
			state: 'active',
			fresh: false
		};
		if (session) {
			if (url.pathname.match('/')) {
				redirect(303, `/${session.user.account_id}/home`);
			}
			return { session };
		}
	} else {
		const session = await locals.auth.validate();
		if (session) {
			if (url.pathname.match('/')) {
				redirect(303, `/${session.user.account_id}/home`);
			}
			return { session };
		}
	}

	return;
};
