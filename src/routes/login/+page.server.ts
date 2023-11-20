import { fail, redirect } from '@sveltejs/kit';

import type { PageServerLoad, Actions } from './$types';
import { isValidEmail, sendEmailVerificationLink } from '$lib/server/email';
import { initializeLucia } from '$lib/server/lucia';
import { generateRandomString } from 'lucia/utils';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();
	if (session) {
		if (!session.user.emailVerified) throw redirect(302, '/email-verification');
		throw redirect(302, '/');
	}
	return {session};
};

export const actions: Actions = {
	default: async ({ request, locals, platform }) => {
		const lucia = initializeLucia(platform?.env.DB);

		const formData = await request.formData();
		const email = formData.get('email');
		const password = formData.get('password');

		// basic check
		if (!isValidEmail) {
			return fail(400, {
				message: 'Not valid'
			});
		}
		if (typeof password !== 'string' || password.length < 6 || password.length > 255) {
			return fail(400, {
				message: 'Invalid password'
			});
		}
		try {
            console.log('creating user');
            console.log(lucia);
			const user = await lucia.createUser({
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
			const session = await lucia.createSession({
				userId: user.userId,
				attributes: {}
			});
			locals.auth.setSession(session);

			const token = generateRandomString(63);
			await platform?.env.tokenEmail.put(token, '');
			await sendEmailVerificationLink(token);
		} catch (e: any) {
			// check for unique constraint error in user table
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
