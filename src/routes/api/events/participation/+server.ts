import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/prisma';
import { error } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const { eventId } = await request.json();
	const eventIdNumber = parseInt(eventId);

	if (isNaN(eventIdNumber)) {
		throw error(400, 'Invalid event ID');
	}

	try {
		// イベントの存在確認
		const event = await prisma.event.findUnique({
			where: { id: eventIdNumber }
		});

		if (!event) {
			throw error(404, 'Event not found');
		}

		// 既に参加登録されているか確認
		const existingParticipation = await prisma.eventParticipation.findUnique({
			where: {
				eventId_userId: {
					eventId: eventIdNumber,
					userId: 1
				}
			}
		});

		if (existingParticipation) {
			throw error(400, 'Already registered for this event');
		}

		const participation = await prisma.eventParticipation.create({
			data: {
				eventId: eventIdNumber,
				userId: 1
			}
		});

		return json(participation);
	} catch (e: any) {
		console.error('Error creating event participation:', e);
		if (e.status) {
			throw e; // SvelteKitのエラーはそのまま投げる
		}
		if (e.code === 'P2002') {
			throw error(400, 'Already registered for this event');
		}
		if (e.code === 'P2003') {
			throw error(400, 'Invalid event ID or user ID');
		}
		throw error(500, 'Failed to register for event: ' + e.message);
	}
};

export const GET: RequestHandler = async () => {
	try {
		const participations = await prisma.eventParticipation.findMany({
			include: {
				event: true,
				user: true
			}
		});

		return json(participations);
	} catch (e) {
		console.error('Error fetching participations:', e);
		throw error(500, 'Failed to fetch participations');
	}
};
