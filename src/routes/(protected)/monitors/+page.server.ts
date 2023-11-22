import { error, fail, redirect } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms/client';
import { API_URL } from '$env/static/private';
import { monitorformSchema } from '$lib/types';
import { checkUrl } from '$lib/utils';

// id:string;
// name
// url: string;
// ssl_verify: boolean;
// follow_redir: boolean;
// method: string;
// req_timeout: number;
// req_headers: reqHeaderType[];
// authentication: reqHeaderType[];
// interval: '24' | '12' | '6' | '3' | '60' | '30' | '15' | '5' | '1';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();
	const monitorform = superValidate(monitorformSchema);
	const user = locals.user
	let monitors: any = [];
	return { session, monitors, monitorform, };
};

export const actions = {
	newmonitor: async ({ request, locals }) => {
		const form = await superValidate(request, monitorformSchema);

		console.log(form);
		if (!form.valid) {
			// Again, return { form } and things will just work.
			return fail(400, { form });
		}
		const transformArray = (arr: string[]) => arr.map((item) => ({ name: item, value: item }));
		const request_headers = JSON.parse(form.data.req_headers || '[]');
		const auth = JSON.parse(form.data.authentication || '{}');
		console.log(auth);
		console.log(request_headers);
		const testurl = await checkUrl({
			url: form.data.url,
			method: form.data.method,
			req_headers: request_headers,
			authentication: auth,
			req_timeout: form.data.req_timeout,
			follow_redir: form.data.follow_redir ?? 'true',
			ssl_verify: form.data.ssl_verify ?? 'true'
		});

		if (!testurl.success) {
			throw error(401, String(testurl.message));
		}
		form.data.id = 'jtabfwcldfpm2d4';
		const createMonitor = await fetch(`${API_URL}/monitor/http/add`, {
			method: 'POST',
			headers: {
				Authorization:
					'Bearer ZGVf1sBBw46sB9l8L0BaEJhJUFT0jY9fm7ztodhgDE3kF3DUyKqK1zgoXBmzXrl1lLYpm059htoWSqYp'
			},
			body: JSON.stringify(form.data)
		});

		const acc = await createMonitor.json();
		console.log(acc.message);
		if (acc.message?.code === '23505') {
			throw error(401, 'Duplicate Account: A account with the same name already exists');
		}
		return { form };
	}
};
