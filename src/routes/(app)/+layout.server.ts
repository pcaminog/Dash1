import { API_URL } from '$env/static/private';

export const load = async ({ locals }) => {
	const session = await locals.auth.validate();
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
		return { userInfo, session };
	}
	return;
};
