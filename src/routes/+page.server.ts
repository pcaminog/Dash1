import { fail, redirect } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	throw redirect(303, `${locals.account_id}/home`);
};
