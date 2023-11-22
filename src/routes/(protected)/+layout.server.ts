import { API_URL } from '$env/static/private';
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	const session = await locals.auth.validate();
	if (session) {
		const getUserInfo = await fetch(`${API_URL}/user/info?user_id=${locals.user}`);
		const { message } = await getUserInfo.json();
		return { session, message };
	}
	return { session };
};
