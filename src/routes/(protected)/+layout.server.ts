import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	const session = await locals.auth.validate();
	if (session) {
		if (!session.user.isValidEmail) throw redirect(302, '/');
		throw redirect(302, '/');
	}
	return { session };
};
