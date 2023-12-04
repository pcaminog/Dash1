import { redirect } from '@sveltejs/kit';

export const load = async ({ locals, url }) => {
	const session = await locals.auth.validate();
	if (session) {
		if (
			url.pathname.endsWith('home') ||
			url.pathname.endsWith('monitor') ||
			url.pathname.endsWith('settings')
		) {
			return { session };
		} else {
			redirect(303, `${session.user.accounts.account_id}/home`);
		}
	}
	return;
};
