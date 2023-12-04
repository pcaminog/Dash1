import { error, fail } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';
import { superValidate, message } from 'sveltekit-superforms/client';
import { settingsnotificationEmailSchema } from '$lib/types';
import { API_URL } from '$env/static/private';

export const load: PageServerLoad = async ({ locals }) => {
	const email = superValidate(settingsnotificationEmailSchema);
	const account = 'be4e35b4-7cff-40c9-af0b-da0052f1cf8d';

	const session = await locals.auth.validate();
	const getMemberReq = await fetch(`${API_URL}/account/members/get?&account_id=${account}`, {
		headers: {
			Authorization:
				'Bearer ZGVf1sBBw46sB9l8L0BaEJhJUFT0jY9fm7ztodhgDE3kF3DUyKqK1zgoXBmzXrl1lLYpm059htoWSqYp'
		}
	});
	const { message: members } = await getMemberReq.json();

	return { session, email, members };
};

export const actions = {
	validationemail: async ({ request }) => {
		const form = await superValidate(request, settingsnotificationEmailSchema);
		if (!form.valid) {
			return fail(400, { form });
		}
		const account = 'be4e35b4-7cff-40c9-af0b-da0052f1cf8d';
		const addEmail = await fetch(
			`${API_URL}/account/settings/emails/validate?email=${form.data.email}&account_id=${account}`,
			{
				method: 'POST',
				headers: {
					Authorization:
						'Bearer ZGVf1sBBw46sB9l8L0BaEJhJUFT0jY9fm7ztodhgDE3kF3DUyKqK1zgoXBmzXrl1lLYpm059htoWSqYp'
				}
			}
		);
		const { success } = await addEmail.json();

		if (!success) {
			throw error(401, 'Error DB deleting the monitor, try again ');
		}

		return { form };
	}
};
