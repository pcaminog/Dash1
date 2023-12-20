import { API_URL, SLACK_CLIENT_ID, SLACK_CLIENT_SECRET } from '$env/static/private';
import { OAuthRequestError } from '@lucia-auth/oauth';
import { redirect } from '@sveltejs/kit';

export const GET = async ({ url }) => {
	const state = url.searchParams.get('state');
	const code = url.searchParams.get('code');

	if (!code || !state) {
		return new Response(null, {
			status: 400
		});
	}
	try {
		const slackReq = await fetch('https://slack.com/api/oauth.v2.access', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: new URLSearchParams({
				code: code,
				client_id: SLACK_CLIENT_ID,
				client_secret: SLACK_CLIENT_SECRET
			})
		});

		const slackRes = await slackReq.json();
		console.log(slackRes);
		if (slackRes.ok) {
			const addSlackAPI = await fetch(
				`${API_URL}/account/settings/integrations/slack/create?account_id=${state}`,
				{
					method: 'POST',
					headers: {
						Authorization:
							'Bearer ZGVf1sBBw46sB9l8L0BaEJhJUFT0jY9fm7ztodhgDE3kF3DUyKqK1zgoXBmzXrl1lLYpm059htoWSqYp'
					},
					body: JSON.stringify({
						...slackRes
					})
				}
			);
			if (!addSlackAPI.ok) {
				return new Response(null, {
					status: 400
				});
			}
			throw redirect(303, `${API_URL}/${state}/settings`);
		}
	} catch (e) {
		if (e instanceof OAuthRequestError) {
			// invalid code
			return new Response(null, {
				status: 400
			});
		}
		return new Response(null, {
			status: 500
		});
	}
};
