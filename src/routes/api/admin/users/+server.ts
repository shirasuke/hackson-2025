import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/prisma';

export const GET: RequestHandler = async () => {
	try {
		const users = await prisma.user.findMany({
			select: {
				id: true,
				username: true,
				email: true
			},
			orderBy: {
				username: 'asc'
			}
		});

		return json(users);
	} catch (error) {
		console.error('ユーザー一覧の取得中にエラーが発生しました:', error);
		return json({ error: 'サーバーエラーが発生しました' }, { status: 500 });
	}
};
