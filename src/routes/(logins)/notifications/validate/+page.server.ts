import { API_URL } from '$env/static/private';

export const load = async ({ url }) => {
	const token = url.searchParams.get('token');

	if (!token) {
        return { status: 'error' };

	}

	try {
		const createAccount = await fetch(`${API_URL}/account/settings/emails/validate?token=${token}`);
		const { message } = await createAccount.json();

		if (message) {
			return { status: 'ok' };
		}
		return { status: 'error' };
	} catch (err) {
		return { status: 'error' };
	}
};
