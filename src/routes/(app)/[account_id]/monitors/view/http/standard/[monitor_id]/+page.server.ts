import { API_URL } from '$env/static/private';
import { message, superValidate } from 'sveltekit-superforms/client';
import type { PageServerLoad } from './$types';
import { deleteMonitorSchema, editMonitorStandardSchema, pauseMonitorSchema } from '$lib/types';
import { error, fail, redirect } from '@sveltejs/kit';

export const load = (async ({ params }) => {
	const DeleteMonitorform = superValidate(deleteMonitorSchema);
	const PausedMonitorform = superValidate(pauseMonitorSchema);
	const editMonitorform = superValidate(editMonitorStandardSchema);

	const monStandardReq = await fetch(
		`${API_URL}/monitor/http/standard/get/details?account_id=${params.account_id}&monitor_id=${params.monitor_id}`,
		{
			headers: {
				Authorization:
					'Bearer ZGVf1sBBw46sB9l8L0BaEJhJUFT0jY9fm7ztodhgDE3kF3DUyKqK1zgoXBmzXrl1lLYpm059htoWSqYp'
			}
		}
	);

	const { message: monStandard } = await monStandardReq.json();
	return { monStandard, DeleteMonitorform, PausedMonitorform, editMonitorform };
}) satisfies PageServerLoad;

export const actions = {
	deletemonitor: async ({ request, params }) => {
		const form = await superValidate(request, deleteMonitorSchema);
		if (!form.valid) {
			return fail(400, { form });
		}
		const deleteMonitor = await fetch(
			`${API_URL}/monitor/http/standard/delete?monitor_id=${form.data.monitor_id}&account_id=${params.account_id}`,
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

		throw redirect(301, `/${params.account_id}/monitors`);
	},
	pausedmonitor: async ({ request, params }) => {
		const form = await superValidate(request, pauseMonitorSchema);
		if (!form.valid) {
			return fail(400, { form });
		}
		console.log(form);
		if (form.data.status === 'active') {
			const deleteMonitor = await fetch(
				`${API_URL}/monitor/http/standard/pause?monitor_id=${form.data.monitor_id}&account_id=${params.account_id}`,
				{
					method: 'PUT',
					headers: {
						Authorization:
							'Bearer ZGVf1sBBw46sB9l8L0BaEJhJUFT0jY9fm7ztodhgDE3kF3DUyKqK1zgoXBmzXrl1lLYpm059htoWSqYp'
					}
				}
			);
			const { success, message: actionMessa } = await deleteMonitor.json();

			if (!success) {
				throw error(401, 'Error DB deleting the monitor, try again ');
			}

			return message(form, actionMessa);
		}

		if (form.data.status === 'paused') {
			const deleteMonitor = await fetch(
				`${API_URL}/monitor/http/standard/resume?monitor_id=${form.data.monitor_id}&account_id=${params.account_id}`,
				{
					method: 'PUT',
					headers: {
						Authorization:
							'Bearer ZGVf1sBBw46sB9l8L0BaEJhJUFT0jY9fm7ztodhgDE3kF3DUyKqK1zgoXBmzXrl1lLYpm059htoWSqYp'
					}
				}
			);
			const { success, message: actionMessa } = await deleteMonitor.json();

			if (!success) {
				throw error(401, 'Error DB deleting the monitor, try again ');
			}

			return message(form, actionMessa);
		}
	}
};
