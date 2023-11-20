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

export const actions: Actions = {
	default: async ({ request, locals, platform }) => {

		const formData = await request.formData();
		const email = formData.get('email');
		const password = 'MagicLink';

		// basic check
		if (!isValidEmail) {
			return fail(400, {
				message: 'Not valid'
			});
		}

		try {
			const user = await locals.lucia.createUser({
				key: {
					providerId: 'email', // auth method
					//@ts-expect-error
					providerUserId: email?.toLowerCase(), // unique id when using "email" auth method
					password // hashed by Lucia
				},
				attributes: {
					//@ts-expect-error
					email: email?.toLowerCase(),
					email_verified: Number(false)
				}
			});
			console.log(user);
			const session = await locals.lucia.createSession({
				userId: user.userId,
				attributes: {}
			});
			locals.auth.setSession(session);
			const { results } = await platform?.env.DB.prepare('SELECT email from user WHERE email = ?')
				.bind(email)
				.all();
			if (results) {
				return fail(500, {
					message: results
				});
			}

			const token = generateRandomString(63);
			await platform?.env.tokenEmail.put(token, user.userId);
			await sendEmailVerificationLink(email!.toString(), token);
		} catch (e: any) {
            console.log(JSON.stringify(e));
			if (e.code === 'SQLITE_CONSTRAINT_UNIQUE') {
				return fail(400, {
					message: 'Account already exists'
				});
			}
			return fail(500, {
				message: 'An unknown error occurred'
			});
		}
		// redirect to
		// make sure you don't throw inside a try/catch block!
		throw redirect(302, '/email-verification');
	}
};
