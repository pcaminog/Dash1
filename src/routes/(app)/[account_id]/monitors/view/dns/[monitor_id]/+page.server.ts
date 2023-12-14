import { API_URL } from '$env/static/private';
import { superValidate } from 'sveltekit-superforms/client';
import type { PageServerLoad } from './$types';
import { deleteMonitorSchema, pauseMonitorSchema } from '$lib/types';
import { error, fail } from '@sveltejs/kit';

export const load = (async ({ params }) => {
	const DeleteMonitorform = superValidate(deleteMonitorSchema);
	const PausedMonitorform = superValidate(pauseMonitorSchema);
	const monDNSReq = await fetch(
		`${API_URL}/monitor/dns/get/details?account_id=${params.account_id}&monitor_id=${params.monitor_id}`,
		{
			headers: {
				Authorization:
					'Bearer ZGVf1sBBw46sB9l8L0BaEJhJUFT0jY9fm7ztodhgDE3kF3DUyKqK1zgoXBmzXrl1lLYpm059htoWSqYp'
			}
		}
	);

	const { message: monDns } = await monDNSReq.json();
	return { monDns, DeleteMonitorform, PausedMonitorform };
}) satisfies PageServerLoad;

export const actions = {
	deletemonitor: async ({ request, params }) => {
		const form = await superValidate(request, deleteMonitorSchema);
		if (!form.valid) {
			return fail(400, { form });
		}
		const deleteMonitor = await fetch(
			`${API_URL}/monitor/dns/delete?monitor_id=${form.data.monitor_id}&account_id=${params.account_id}`,
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
	pausedmonitor: async ({ request, params }) => {
		const form = await superValidate(request, pauseMonitorSchema);
		if (!form.valid) {
			return fail(400, { form });
		}
		if (form.data.status === 'active') {
			const deleteMonitor = await fetch(
				`${API_URL}/monitor/dns/pause?id=${form.data.monitor_id}&account_id=${params.account_id}`,
				{
					method: 'PUT',
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

		if (form.data.status === 'paused') {
			const deleteMonitor = await fetch(
				`${API_URL}/monitor/dns/resume?id=${form.data.monitor_id}&account_id=${params.account_id}`,
				{
					method: 'PUT',
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
	}
};
