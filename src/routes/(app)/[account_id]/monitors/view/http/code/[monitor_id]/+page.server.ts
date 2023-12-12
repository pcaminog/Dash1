import { API_URL } from '$env/static/private';
import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
	const monStandardReq = await fetch(
		`${API_URL}/monitor/http/code/get/details?account_id=${params.account_id}&monitor_id=${params.monitor_id}`,
		{
			headers: {
				Authorization:
					'Bearer ZGVf1sBBw46sB9l8L0BaEJhJUFT0jY9fm7ztodhgDE3kF3DUyKqK1zgoXBmzXrl1lLYpm059htoWSqYp'
			}
		}
	);

	const { message: monStandard } = await monStandardReq.json();
	return { monStandard };
}) satisfies PageServerLoad;
