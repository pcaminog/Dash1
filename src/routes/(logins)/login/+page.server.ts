import { fail, redirect } from '@sveltejs/kit';

import type { PageServerLoad, Actions } from './$types';
import { isValidEmail, sendEmailVerificationLink } from '$lib/server/email';
import { initializeLucia } from '$lib/server/lucia';
import { generateRandomString } from 'lucia/utils';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();
	if (session) {
		if (!session.user.isValidEmail) throw redirect(302, '/');
		throw redirect(302, '/');
	}
	return { session };
};
