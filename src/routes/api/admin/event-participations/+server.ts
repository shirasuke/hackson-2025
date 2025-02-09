import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/prisma';
import { error } from '@sveltejs/kit';

// 全ての参加申請を取得
export const GET: RequestHandler = async () => {
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
export const PUT: RequestHandler = async ({ request }) => {
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
		if (e.code === 'P2025') {
			throw error(404, 'Participation not found');
		}
		throw error(500, 'Failed to update participation status');
	}
};
