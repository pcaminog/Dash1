import { API_URL } from '$env/static/private';
import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
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
	return { monDns };
}) satisfies PageServerLoad;
