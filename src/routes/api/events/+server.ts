import { json } from '@sveltejs/kit';
import { prisma } from '$lib/prisma';
import type { RequestHandler } from './$types';
import { error } from '@sveltejs/kit';

// イベント一覧を取得
export const GET: RequestHandler = async () => {
	try {
		// イベント一覧を取得
		const events = await prisma.event.findMany({
			orderBy: {
				date: 'asc'
			}
		});

		// レスポンスデータの整形
		const formattedEvents = events.map((event) => ({
			id: event.id,
			title: event.title,
			description: event.description,
			date: event.date.toISOString(),
			location: event.location,
			organizer: event.organizer,
			contact: event.contact,
			isParticipating: false // 認証機能実装後に修正
		}));

		return json(formattedEvents);
	} catch (e) {
		console.error('Error fetching events:', e);
		throw error(500, 'Failed to fetch events');
	}
};

// 新規イベントを作成
export const POST: RequestHandler = async ({ request }) => {
	try {
		const data = await request.json();

		// 必須項目の検証
		if (
			!data.title ||
			!data.description ||
			!data.date ||
			!data.location ||
			!data.organizer ||
			!data.contact
		) {
			return json({ error: '必須項目が入力されていません' }, { status: 400 });
		}

		const event = await prisma.event.create({
			data: {
				title: data.title,
				description: data.description,
				date: new Date(data.date),
				location: data.location,
				organizer: data.organizer,
				contact: data.contact
			}
		});

		return json(event);
	} catch (error) {
		console.error('Error creating event:', error);
		return json({ error: 'イベントの作成に失敗しました' }, { status: 500 });
	}
};
