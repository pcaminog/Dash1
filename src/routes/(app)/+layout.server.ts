import { dev } from '$app/environment';
import { API_URL } from '$env/static/private';
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
				account_id: '967d725e-53a3-4083-b515-6956f4ff75db',
				account_name: 'My Organization',
				account_plan: 'free',
				userId: 'plv6xplur2cmhtp'
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

			const alertCountReq = await fetch(
				`${API_URL}/account/alerts/count/get?account_id=${session.user.account_id}`,
				{
					headers: {
						Authorization:
							'Bearer ZGVf1sBBw46sB9l8L0BaEJhJUFT0jY9fm7ztodhgDE3kF3DUyKqK1zgoXBmzXrl1lLYpm059htoWSqYp'
					}
				}
			);
			const { message: alert_count } = await alertCountReq.json();
			return { session, alert_count };
		}
	} else {
		const session = await locals.auth.validate();
		if (session) {
			if (url.pathname.match('/')) {
				redirect(303, `/${session.user.account_id}/home`);
			}
			const alertCountReq = await fetch(
				`${API_URL}/account/alerts/count/get?account_id=${session.user.account_id}`,
				{
					headers: {
						Authorization:
							'Bearer ZGVf1sBBw46sB9l8L0BaEJhJUFT0jY9fm7ztodhgDE3kF3DUyKqK1zgoXBmzXrl1lLYpm059htoWSqYp'
					}
				}
			);
			const { message: alert_count } = await alertCountReq.json();

			return { session, alert_count };
		}
	}

	return;
};
