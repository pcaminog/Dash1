import { API_URL } from '$env/static/private';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const user = 'jtabfwcldfpm2d4';
	const getUserInfo = await fetch(`${API_URL}/user/info?user_id=${user}`, {
		headers: {
			Authorization:
				'Bearer ZGVf1sBBw46sB9l8L0BaEJhJUFT0jY9fm7ztodhgDE3kF3DUyKqK1zgoXBmzXrl1lLYpm059htoWSqYp'
		}
	});
	const { message: userInfo } = await getUserInfo.json();
	return { userInfo };
};
