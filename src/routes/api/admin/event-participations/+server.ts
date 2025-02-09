import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/prisma';

export const GET: RequestHandler = async ({ url }) => {
	const month = url.searchParams.get('month');
	if (!month) {
		return json({ error: '月の指定が必要です' }, { status: 400 });
	}

	const [year, monthNum] = month.split('-').map(Number);
	const startDate = new Date(year, monthNum - 1, 1);
	const endDate = new Date(year, monthNum, 0);

	try {
		const events = await prisma.event.findMany({
			where: {
				date: {
					gte: startDate,
					lte: endDate
				}
			},
			include: {
				_count: {
					select: {
						participants: true
					}
				}
			}
		});

		const eventParticipations = events.map((event) => ({
			eventId: event.id,
			eventName: event.name,
			date: event.date.toISOString(),
			participantCount: event._count.participants
		}));

		return json(eventParticipations);
	} catch (error) {
		console.error('イベント参加情報の取得中にエラーが発生しました:', error);
		return json({ error: 'サーバーエラーが発生しました' }, { status: 500 });
	}
};
