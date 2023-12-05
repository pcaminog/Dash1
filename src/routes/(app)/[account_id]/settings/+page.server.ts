import { error, fail } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';
import { superValidate, message } from 'sveltekit-superforms/client';
import { settingsnotificationEmailSchema } from '$lib/types';
import { API_URL } from '$env/static/private';

export const load: PageServerLoad = async ({ locals }) => {
	const email = superValidate(settingsnotificationEmailSchema);
	const emailres = superValidate(settingsnotificationEmailSchema);
	const emaildel = superValidate(settingsnotificationEmailSchema);

	const session = await locals.auth.validate();
	const getMemberReq = await fetch(
		`${API_URL}/account/settings/emails/notifications?&account_id=${locals.account_id}`,
		{
			headers: {
				Authorization:
					'Bearer ZGVf1sBBw46sB9l8L0BaEJhJUFT0jY9fm7ztodhgDE3kF3DUyKqK1zgoXBmzXrl1lLYpm059htoWSqYp'
			}
		}
	);
	const { message: Notiemails } = await getMemberReq.json();

	return { session, email, Notiemails, emailres, emaildel };
};

export const actions = {
	validationemail: async ({ request, params }) => {
		const form = await superValidate(request, settingsnotificationEmailSchema);
		if (!form.valid) {
			return fail(400, { form });
		}

		const addEmail = await fetch(
			`${API_URL}/account/settings/emails/validate?email=${form.data.email}&account_id=${params.account_id}`,
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
	},
	resendEmail: async ({ request, params }) => {
		const form = await superValidate(request, settingsnotificationEmailSchema);
		if (!form.valid) {
			return fail(400, { form });
		}

		const addEmail = await fetch(
			`${API_URL}/account/settings/emails/resend?email=${form.data.email}&account_id=${params.account_id}`,
			{
				method: 'PUT',
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
	},
	deleteemail: async ({ request, params }) => {
		const form = await superValidate(request, settingsnotificationEmailSchema);

		if (!form.valid) {
			return fail(400, { form });
		}
		const addEmail = await fetch(
			`${API_URL}/account/settings/emails/delete?email=${form.data.email}&account_id=${params.account_id}`,
			{
				method: 'DELETE',
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
