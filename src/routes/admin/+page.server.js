import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	if (!locals.user.admin) {
		return redirect(302, '/login');
	}
	const username = locals.user.name;
	return { username };
};
