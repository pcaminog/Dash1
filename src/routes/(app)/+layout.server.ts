import { API_URL } from '$env/static/private';
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	// const session = await locals.auth.validate();

	const session = {
		user: {
			userId: 'a3ajyquetwkm5z7'
		},
		sessionId: 'dwy4p8imkhg8dn0ppdgv6hbxlzizgcxnqmvc7h9v',
		activePeriodExpiresAt: '2023-12-04T01:29:59.195Z',
		idlePeriodExpiresAt: '2023-12-18T01:29:59.195Z',
		state: 'active',
		fresh: false
	};

	if (session) {
		const getUserInfo = await fetch(`${API_URL}/user/info?user_id=${session.user.userId}`, {
			headers: {
				Authorization:
					'Bearer ZGVf1sBBw46sB9l8L0BaEJhJUFT0jY9fm7ztodhgDE3kF3DUyKqK1zgoXBmzXrl1lLYpm059htoWSqYp'
			}
		});
		if (getUserInfo.status === 401) {
			return { session };
		}
		const { message: userInfo } = await getUserInfo.json();
		console.log(userInfo);
		return { userInfo, session };
	}
	return;
};
