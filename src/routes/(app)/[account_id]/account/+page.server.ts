import { error, fail } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms/client';
import {
	accountnameSchema,
	deleteMemberEmailSchema,
	inviteMemberEmailSchema,
	resendMemberEmailSchema,
	settingsnotificationEmailSchema
} from '$lib/types';
import { API_URL } from '$env/static/private';
import { LuciaError } from 'lucia';

export const load: PageServerLoad = async ({ params }) => {
	const invitationemail = superValidate(inviteMemberEmailSchema);
	const delmember = superValidate(deleteMemberEmailSchema);
	const memberres = superValidate(resendMemberEmailSchema);
	const accountname = superValidate(accountnameSchema);

	const getMemberReq = await fetch(
		`${API_URL}/account/members/get?&account_id=${params.account_id}`,
		{
			headers: {
				Authorization:
					'Bearer ZGVf1sBBw46sB9l8L0BaEJhJUFT0jY9fm7ztodhgDE3kF3DUyKqK1zgoXBmzXrl1lLYpm059htoWSqYp'
			}
		}
	);
	const { message: members } = await getMemberReq.json();

	return { invitationemail, members, delmember, memberres, accountname };
};

export const actions = {
	accountname: async ({ request, params, locals }) => {
		const form = await superValidate(request, accountnameSchema);
		if (!form.valid) {
			return fail(400, { form });
		}

		const changename = await fetch(
			`${API_URL}/account/name/update?name=${form.data.account_name}&account_id=${params.account_id}`,
			{
				method: 'PUT',
				headers: {
					Authorization:
						'Bearer ZGVf1sBBw46sB9l8L0BaEJhJUFT0jY9fm7ztodhgDE3kF3DUyKqK1zgoXBmzXrl1lLYpm059htoWSqYp'
				}
			}
		);
		const { success } = await changename.json();

		if (!success) {
			throw error(401, 'Error DB deleting the monitor, try again ');
		}

		try {
			await locals.lucia.updateUserAttributes(locals.user, {
				account_name: form.data.account_name
			});
		} catch (e) {
			if (e instanceof LuciaError && e.message === `AUTH_INVALID_USER_ID`) {
				console.log(e);
			}
			console.log(e);
		}

		return { form };
	},
	invitationemail: async ({ request, params }) => {
		const form = await superValidate(request, inviteMemberEmailSchema);
		if (!form.valid) {
			return fail(400, { form });
		}

		const addEmail = await fetch(
			`${API_URL}/account/members/invite?email=${form.data.email}&account_id=${params.account_id}`,
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
	resendEmail: async ({ request, params, locals }) => {
		const form = await superValidate(request, resendMemberEmailSchema);
		if (!form.valid) {
			return fail(400, { form });
		}

		// const addEmail = await fetch(
		// 	`${API_URL}/account/settings/emails/resend?email=${form.data.email}&account_id=${params.account_id}`,
		// 	{
		// 		method: 'PUT',
		// 		headers: {
		// 			Authorization:
		// 				'Bearer ZGVf1sBBw46sB9l8L0BaEJhJUFT0jY9fm7ztodhgDE3kF3DUyKqK1zgoXBmzXrl1lLYpm059htoWSqYp'
		// 		}
		// 	}
		// );
		// const { success } = await addEmail.json();

		// if (!success) {
		// 	throw error(401, 'Error DB deleting the monitor, try again ');
		// }

		return { form };
	},
	deletemember: async ({ request, locals, params }) => {
		const form = await superValidate(request, deleteMemberEmailSchema);
		console.log(form);
		if (!form.valid) {
			return fail(400, { form });
		}

		if (form.data.email === locals.session.user.email) {
			throw error(
				401,
				'You cannot delete yourself as a active member. Pleae ask another member to remove your access.'
			);
		}

		await locals.lucia.deleteUser(form.data.user_id);

		return { form };
	}
};
