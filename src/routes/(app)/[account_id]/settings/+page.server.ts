import { error, fail } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';
import { superValidate, message } from 'sveltekit-superforms/client';
import {
	createwebhookSchema,
	deletewebhookSchema,
	settingsnotificationEmailSchema,
	validatewebhookSchema
} from '$lib/types';
import { API_URL } from '$env/static/private';

export const load: PageServerLoad = async ({ params, locals }) => {
	const email = superValidate(settingsnotificationEmailSchema);
	const emailres = superValidate(settingsnotificationEmailSchema);
	const emaildel = superValidate(settingsnotificationEmailSchema);
	const createwebhooks = superValidate(createwebhookSchema);
	const validatewebhooks = superValidate(validatewebhookSchema);
	const deletewebhooks = superValidate(deletewebhookSchema);

	const session = await locals.auth.validate();
	const getMemberReq = await fetch(
		`${API_URL}/account/settings/emails/notifications?&account_id=${params.account_id}`,
		{
			headers: {
				Authorization:
					'Bearer ZGVf1sBBw46sB9l8L0BaEJhJUFT0jY9fm7ztodhgDE3kF3DUyKqK1zgoXBmzXrl1lLYpm059htoWSqYp'
			}
		}
	);
	const { message: Notiemails } = await getMemberReq.json();
	const getWebhookReq = await fetch(
		`${API_URL}/account/settings/webhooks?&account_id=${params.account_id}`,
		{
			headers: {
				Authorization:
					'Bearer ZGVf1sBBw46sB9l8L0BaEJhJUFT0jY9fm7ztodhgDE3kF3DUyKqK1zgoXBmzXrl1lLYpm059htoWSqYp'
			}
		}
	);
	const { message: Webhooks } = await getWebhookReq.json();

	const getIntegrations = await fetch(
		`${API_URL}/account/settings/integrations?&account_id=${params.account_id}`,
		{
			headers: {
				Authorization:
					'Bearer ZGVf1sBBw46sB9l8L0BaEJhJUFT0jY9fm7ztodhgDE3kF3DUyKqK1zgoXBmzXrl1lLYpm059htoWSqYp'
			}
		}
	);
	const { message: integrations } = await getIntegrations.json();

	return {
		session,
		email,
		Notiemails,
		Webhooks,
		integrations,
		emailres,
		emaildel,
		createwebhooks,
		validatewebhooks,
		deletewebhooks
	};
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
	},
	createwebhook: async ({ request, params }) => {
		const form = await superValidate(request, createwebhookSchema);
		console.log(form);
		if (!form.valid) {
			return fail(400, { form });
		}
		const createWebhook = await fetch(
			`${API_URL}/account/settings/webhooks/create?account_id=${params.account_id}`,
			{
				method: 'POST',
				headers: {
					Authorization:
						'Bearer ZGVf1sBBw46sB9l8L0BaEJhJUFT0jY9fm7ztodhgDE3kF3DUyKqK1zgoXBmzXrl1lLYpm059htoWSqYp'
				},
				body: JSON.stringify({ url: form.data.url })
			}
		);
		const { success } = await createWebhook.json();

		if (!success) {
			throw error(401, 'Error DB deleting the monitor, try again ');
		}

		return { form };
	},
	validatewebhook: async ({ request, params }) => {
		const form = await superValidate(request, validatewebhookSchema);

		if (!form.valid) {
			return fail(400, { form });
		}
		const validateWebhook = await fetch(
			`${API_URL}/account/settings/webhooks/validate?webhook_id=${form.data.webhook_id}&account_id=${params.account_id}`,
			{
				headers: {
					Authorization:
						'Bearer ZGVf1sBBw46sB9l8L0BaEJhJUFT0jY9fm7ztodhgDE3kF3DUyKqK1zgoXBmzXrl1lLYpm059htoWSqYp'
				}
			}
		);
		const { success } = await validateWebhook.json();

		if (!success) {
			throw error(401, 'Error DB deleting the monitor, try again ');
		}

		return { form };
	},
	deletewebhook: async ({ request, params }) => {
		const form = await superValidate(request, deletewebhookSchema);

		if (!form.valid) {
			return fail(400, { form });
		}
		const addEmail = await fetch(
			`${API_URL}/account/settings/emails/delete?email=${form.data.webhook_id}&account_id=${params.account_id}`,
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
