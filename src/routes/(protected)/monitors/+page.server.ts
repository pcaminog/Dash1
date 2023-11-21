import { error, fail, redirect } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';
import { z } from 'zod';
import { message, superValidate } from 'sveltekit-superforms/client';
import { API_URL } from '$env/static/private';

const monitorformSchema = z.object({
	id: z.string().optional(),

	name: z
		.string()
		.min(1, { message: 'Name is required' })
		.max(50, { message: 'Name cannot have more than 50 characteres' }),
	type: z.enum(['standard', 'codespecific'], {
		errorMap: (issue, ctx) => ({ message: 'Please select a monitor type.' })
	}),
	ssl_verify: z.string().optional(),
	url: z.string().min(1, { message: 'URL is required.' }),
	method: z.string().min(1, { message: 'Method is required.' }),
	interval: z.string().min(1, { message: 'Interval is required.' }),
	follow_redir: z.string().optional(),
	req_timeout: z.string().min(1, { message: 'Please select a timeout' }),
	req_headers: z.array(z.string()).optional(),
	authentication: z.array(z.string()).optional(),
	status_code: z.number().min(100).max(599).optional()
});

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

	let monitors: any = [];
	return { session, monitors, monitorform };
};

export const actions = {
	newmonitor: async ({ request, locals }) => {
		const form = await superValidate(request, monitorformSchema);

		console.log(form);
		if (!form.valid) {
			// Again, return { form } and things will just work.
			return fail(400, { form });
		}
		form.data.id = locals.user;
		const createMonitor = await fetch(`${API_URL}/monitor/http/add`, {
			method: 'POST',
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
