import { redirect } from '@sveltejs/kit';

export const load = async ({ locals, url }) => {
	const session = await locals.auth.validate();

	// const session = {
	// 	user: {
	// 		email: 'pcaminog@outlook.com',
	// 		username: 'pcaminog',
	// 		avatar: 'https://avatars.githubusercontent.com/u/26197615?v=4',
	// 		name: 'Pablo Camino',
	// 		accounts:
	// 			'{"account_id":"210ab1d7-cb14-4140-8832-8fcc31570879","account_name":"My Organization","plan":"free"}',
	// 		userId: 'hn8q6lw117bv97u'
	// 	},
	// 	sessionId: 'm888f8fvag29v0ah3xr8yhhh7wmhoz4evqrxjcrk',
	// 	activePeriodExpiresAt: '2023-12-05T20:24:45.990Z',
	// 	idlePeriodExpiresAt: '2023-12-19T20:24:45.990Z',
	// 	state: 'active',
	// 	fresh: false
	// };

	if (session) {
		if (url.pathname.match('/')) {
			redirect(303, `/${session.user.account_id}/home`);
		}
		return { session };
	}
	return;
};
