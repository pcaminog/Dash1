import { API_URL } from '$env/static/private';
import { fakeSession } from '$lib/utils.js';
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	// const session = await locals.auth.validate();
	const session = { ...fakeSession };
	console.log('locals from layout', locals);
	if (session) {
		const getUserInfo = await fetch(`${API_URL}/user/info?user_id=${locals.session.user.userId}`, {
			headers: {
				Authorization:
					'Bearer ZGVf1sBBw46sB9l8L0BaEJhJUFT0jY9fm7ztodhgDE3kF3DUyKqK1zgoXBmzXrl1lLYpm059htoWSqYp'
			}
		});
		if (getUserInfo.status === 401) {
			return { session };
		}
		const { message: userInfo } = await getUserInfo.json();
		locals.userInfo = userInfo;
		console.log(locals.userInfo);
		return { userInfo, session };
	}
	return;
};
