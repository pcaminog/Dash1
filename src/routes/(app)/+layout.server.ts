import { API_URL } from '$env/static/private';
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	const user = 'jtabfwcldfpm2d4';
	const session = { userId: 'jtabfwcldfpm2d4' };

	const getUserInfo = await fetch(`${API_URL}/user/info?user_id=${user}`, {
		headers: {
			Authorization:
				'Bearer ZGVf1sBBw46sB9l8L0BaEJhJUFT0jY9fm7ztodhgDE3kF3DUyKqK1zgoXBmzXrl1lLYpm059htoWSqYp'
		}
	});
	const { message: userInfo } = await getUserInfo.json();
	console.log(userInfo);
	return { userInfo, session };
};
