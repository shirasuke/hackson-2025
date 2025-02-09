import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/prisma';
import { error } from '@sveltejs/kit';

export const DELETE: RequestHandler = async ({ params, locals }) => {
	const session = await locals.getSession();
	if (!session?.user?.email) {
		throw error(401, 'Unauthorized');
	}

	const eventId = parseInt(params.eventId);
	if (isNaN(eventId)) {
		throw error(400, 'Invalid event ID');
	}

	try {
		const user = await prisma.user.findUnique({
			where: { email: session.user.email }
		});

		if (!user) {
			throw error(404, 'User not found');
		}

		await prisma.eventParticipation.delete({
			where: {
				eventId_userId: {
					eventId,
					userId: user.id
				}
			}
		});

		return json({ success: true });
	} catch (e) {
		console.error('Error canceling participation:', e);
		throw error(500, 'Failed to cancel participation');
	}
};
