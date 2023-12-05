import { error, fail } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms/client';
import { API_URL } from '$env/static/private';
import { checkUrl } from '$lib/utils';
import {
	delMonitorSchema,
	monitorCodeSchema,
	monitorDNSschema,
	monitorStandardSchema
} from '$lib/types';

export const load: PageServerLoad = async ({ locals, params }) => {
	const session = await locals.auth.validate();
	const monitorStandardform = superValidate(monitorStandardSchema);
	const monitorCodeform = superValidate(monitorCodeSchema);
	const monitorDNSform = superValidate(monitorDNSschema);
	const delMonitorForm = superValidate(delMonitorSchema);
	// const updateDNSform = superValidate(monitorDNSschema);

	const monStandardReq = await fetch(
		`${API_URL}/monitor/http/standard/get?account_id=${params.account_id}`,
		{
			headers: {
				Authorization:
					'Bearer ZGVf1sBBw46sB9l8L0BaEJhJUFT0jY9fm7ztodhgDE3kF3DUyKqK1zgoXBmzXrl1lLYpm059htoWSqYp'
			}
		}
	);
	const { message: monStandard } = await monStandardReq.json();
	const monCodeReq = await fetch(
		`${API_URL}/monitor/http/code/get?account_id=${params.account_id}`,
		{
			headers: {
				Authorization:
					'Bearer ZGVf1sBBw46sB9l8L0BaEJhJUFT0jY9fm7ztodhgDE3kF3DUyKqK1zgoXBmzXrl1lLYpm059htoWSqYp'
			}
		}
	);
	const { message: monCode } = await monCodeReq.json();
	const monDNSReq = await fetch(`${API_URL}/monitor/dns/get?account_id=${params.account_id}`, {
		headers: {
			Authorization:
				'Bearer ZGVf1sBBw46sB9l8L0BaEJhJUFT0jY9fm7ztodhgDE3kF3DUyKqK1zgoXBmzXrl1lLYpm059htoWSqYp'
		}
	});
	const { message: monDns } = await monDNSReq.json();

	return {
		session,
		standard: monStandard,
		code: monCode,
		dns: monDns,
		monitorStandardform,
		monitorCodeform,
		monitorDNSform,
		// updateDNSform,
		delMonitorForm
	};
};

export const actions = {
	delstandard: async ({ request, params }) => {
		const form = await superValidate(request, delMonitorSchema);
		if (!form.valid) {
			return fail(400, { form });
		}
		const deleteMonitor = await fetch(
			`${API_URL}/monitor/http/standard/delete?id=${form.data.mon_id}&account_id=${params.account_id}`,
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
	},
	delcode: async ({ request, params }) => {
		const form = await superValidate(request, delMonitorSchema);
		if (!form.valid) {
			return fail(400, { form });
		}
		const deleteMonitor = await fetch(
			`${API_URL}/monitor/http/code/delete?id=${form.data.mon_id}&account_id=${params.account_id}`,
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
	},
	deldns: async ({ request, params }) => {
		const form = await superValidate(request, delMonitorSchema);
		if (!form.valid) {
			return fail(400, { form });
		}
		const deleteMonitor = await fetch(
			`${API_URL}/monitor/dns/delete?id=${form.data.mon_id}&account_id=${params.account_id}`,
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
	},
	newstandard: async ({ request, params, locals }) => {
		const form = await superValidate(request, monitorStandardSchema);

		if (!form.valid) {
			// Again, return { form } and things will just work.
			return fail(400, { form });
		}
		const request_headers = JSON.parse(form.data.req_headers || '[]');
		const auth = JSON.parse(form.data.authentication || '{}');

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

		const createMonitor = await fetch(
			`${API_URL}/monitor/http/standard/add?account_id=${params.account_id}&user_id=${locals.user}`,
			{
				method: 'POST',
				headers: {
					Authorization:
						'Bearer ZGVf1sBBw46sB9l8L0BaEJhJUFT0jY9fm7ztodhgDE3kF3DUyKqK1zgoXBmzXrl1lLYpm059htoWSqYp'
				},
				body: JSON.stringify({
					id: locals.user,
					account_id: params.account_id,
					name: form.data.name,
					url: form.data.url,
					method: form.data.method,
					req_headers: request_headers,
					authentication: auth,
					checks_down: form.data.checks_down,
					checks_up: form.data.checks_up,
					req_timeout: form.data.req_timeout,
					follow_redir: form.data.follow_redir ?? 'true',
					ssl_verify: form.data.ssl_verify ?? 'true',
					interval: form.data.interval
				})
			}
		);

		const acc = await createMonitor.json();
		if (acc.message?.code === '23505') {
			throw error(401, 'Duplicate Account: A account with the same name already exists');
		}
		return { form };
	},
	newdns: async ({ request, locals, params }) => {
		const form = await superValidate(request, monitorDNSschema);

		if (!form.valid) {
			// Again, return { form } and things will just work.
			return fail(400, { form });
		}

		const newarrr = form.data.IPs.split(',');
		const createMonitor = await fetch(
			`${API_URL}/monitor/dns/add?account_id=${params.account_id}&user_id=${locals.user}`,
			{
				method: 'POST',
				headers: {
					Authorization:
						'Bearer ZGVf1sBBw46sB9l8L0BaEJhJUFT0jY9fm7ztodhgDE3kF3DUyKqK1zgoXBmzXrl1lLYpm059htoWSqYp'
				},
				body: JSON.stringify({
					id: locals.user,
					account_id: params.account_id,
					name: form.data.name,
					hostname: form.data.hostname,
					checks_down: form.data.checks_down,
					checks_up: form.data.checks_up,
					ips: newarrr,
					interval: form.data.interval
				})
			}
		);
		const acc = await createMonitor.json();
		if (acc.message?.code === '23505') {
			throw error(401, 'Duplicate Account: A account with the same name already exists');
		}
		return { form };
	},
	// updatedns: async ({ request, locals }) => {
	// 	const form = await superValidate(request, monitorDNSschema);

	// 	if (!form.valid) {
	// 		// Again, return { form } and things will just work.
	// 		return fail(400, { form });
	// 	}
	// 	console.log(form);
	// 	form.data.id = 'jtabfwcldfpm2d4';
	// 	form.data.account_id = 'be4e35b4-7cff-40c9-af0b-da0052f1cf8d';
	// 	const newarrr = form.data.IPs.split(',');
	// 	const createMonitor = await fetch(`${API_URL}/monitor/dns/add`, {
	// 		method: 'POST',
	// 		headers: {
	// 			Authorization:
	// 				'Bearer ZGVf1sBBw46sB9l8L0BaEJhJUFT0jY9fm7ztodhgDE3kF3DUyKqK1zgoXBmzXrl1lLYpm059htoWSqYp'
	// 		},
	// 		body: JSON.stringify({
	// 			id: form.data.id,
	// 			account_id: form.data.account_id,
	// 			name: form.data.name,
	// 			hostname: form.data.hostname,
	// 			checks_down: form.data.checks_down,
	// 			checks_up: form.data.checks_up,
	// 			ips: newarrr,
	// 			interval: form.data.interval
	// 		})
	// 	});
	// 	const acc = await createMonitor.json();
	// 	if (acc.message?.code === '23505') {
	// 		throw error(401, 'Duplicate Account: A account with the same name already exists');
	// 	}
	// 	return { form };
	// },
	newcode: async ({ request, locals, params }) => {
		const form = await superValidate(request, monitorCodeSchema);

		if (!form.valid) {
			// Again, return { form } and things will just work.
			return fail(400, { form });
		}
		const request_headers = JSON.parse(form.data.req_headers || '[]');
		const auth = JSON.parse(form.data.authentication || '{}');

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

		const createMonitor = await fetch(
			`${API_URL}/monitor/http/code/add?account_id=${params.account_id}&user_id=${locals.user}`,
			{
				method: 'POST',
				headers: {
					Authorization:
						'Bearer ZGVf1sBBw46sB9l8L0BaEJhJUFT0jY9fm7ztodhgDE3kF3DUyKqK1zgoXBmzXrl1lLYpm059htoWSqYp'
				},
				body: JSON.stringify({
					id: locals.user,
					account_id: params.account_id,
					name: form.data.name,
					url: form.data.url,
					method: form.data.method,
					req_headers: request_headers,
					authentication: auth,
					checks_down: form.data.checks_down,
					checks_up: form.data.checks_up,
					req_timeout: form.data.req_timeout,
					follow_redir: form.data.follow_redir ?? 'true',
					ssl_verify: form.data.ssl_verify ?? 'true',
					interval: form.data.interval,
					status_code: form.data.status_code
				})
			}
		);

		const acc = await createMonitor.json();
		if (acc.message?.code === '23505') {
			throw error(401, 'Duplicate Account: A account with the same name already exists');
		}
		return { form };
	}
};
