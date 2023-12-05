import { API_URL } from '$env/static/private';

export const load = async ({ url }) => {
	const token = url.searchParams.get('token');

	if (!token) {
		return { status: 'error' };
	}
	try {
		const createAccount = await fetch(
			`${API_URL}/account/settings/emails/validate?token=${token}`,
			{
				headers: {
					Authorization:
						'Bearer ZGVf1sBBw46sB9l8L0BaEJhJUFT0jY9fm7ztodhgDE3kF3DUyKqK1zgoXBmzXrl1lLYpm059htoWSqYp'
				}
			}
		);
		const { message } = await createAccount.json();

		if (message) {
			return { status: 'ok' };
		}
		return { status: 'error' };
	} catch (err) {
		return { status: 'error' };
	}
};
