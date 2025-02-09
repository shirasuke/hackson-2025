import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PrismaClient } from '@prisma/client';
import { error } from '@sveltejs/kit';

const prisma = new PrismaClient();

// 全ての参加申請を取得
export const GET: RequestHandler = async ({ locals }) => {
	const session = await locals.getSession();
	if (!session?.user?.email) {
		throw error(401, 'Unauthorized');
	}

	// 管理者チェック
	const user = await prisma.user.findUnique({
		where: { email: session.user.email }
	});

	if (!user || user.email !== 'admin@example.com') {
		// TODO: 適切な管理者チェックに変更
		throw error(403, 'Forbidden');
	}

	try {
		const participations = await prisma.eventParticipation.findMany({
			include: {
				user: {
					select: {
						id: true,
						username: true,
						email: true
					}
				},
				event: true
			}
		});

		return json(participations);
	} catch (e) {
		console.error('Error fetching participations:', e);
		throw error(500, 'Failed to fetch participations');
	}
};

// 参加申請のステータスを更新
export const PUT: RequestHandler = async ({ request, locals }) => {
	const session = await locals.getSession();
	if (!session?.user?.email) {
		throw error(401, 'Unauthorized');
	}

	// 管理者チェック
	const user = await prisma.user.findUnique({
		where: { email: session.user.email }
	});

	if (!user || user.email !== 'admin@example.com') {
		// TODO: 適切な管理者チェックに変更
		throw error(403, 'Forbidden');
	}

	const { participationId, status } = await request.json();

	if (!['approved', 'rejected'].includes(status)) {
		throw error(400, 'Invalid status');
	}

	try {
		const updatedParticipation = await prisma.eventParticipation.update({
			where: { id: participationId },
			data: { status },
			include: {
				user: {
					select: {
						id: true,
						username: true,
						email: true
					}
				},
				event: true
			}
		});

		return json(updatedParticipation);
	} catch (e) {
		console.error('Error updating participation status:', e);
		throw error(500, 'Failed to update participation status');
	}
};
