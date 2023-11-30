import { fail, redirect } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms/client';
import { settingsnotificationEmailSchema } from '$lib/types';
import { API_URL } from '$env/static/private';
import { error } from 'console';

export const load: PageServerLoad = async ({ locals }) => {
	const email = superValidate(settingsnotificationEmailSchema);

	const session = await locals.auth.validate();

	return { session, email };
};

export const actions = {
	validationemail: async ({ request }) => {
		const form = await superValidate(request, settingsnotificationEmailSchema);
		if (!form.valid) {
			return fail(400, { form });
		}
		const account = 'be4e35b4-7cff-40c9-af0b-da0052f1cf8d';
		const deleteMonitor = await fetch(
			`${API_URL}/account/settings/emails/validate?email=${form.data.email}&account_id=${account}`,
			{
				method: 'DELETE',
				headers: {
					Authorization:
						'Bearer ZGVf1sBBw46sB9l8L0BaEJhJUFT0jY9fm7ztodhgDE3kF3DUyKqK1zgoXBmzXrl1lLYpm059htoWSqYp'
				}
			}
		);
		const { success } = await deleteMonitor.json();

		if (!success) {
			throw error(401, 'Error DB deleting the monitor, try again ');
		}

		return { form };
	}
};
