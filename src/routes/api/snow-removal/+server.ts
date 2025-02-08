// src/routes/api/snow-removal/+server.ts
import { json } from '@sveltejs/kit';
import { prisma } from '$lib/prisma';
import type { RequestHandler } from './$types';

// 本日の記録を取得
export const GET: RequestHandler = async () => {
	try {
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		const tomorrow = new Date(today);
		tomorrow.setDate(tomorrow.getDate() + 1);

		const records = await prisma.snowRemovalRecord.findMany({
			where: {
				date: {
					gte: today,
					lt: tomorrow
				}
			},
			orderBy: {
				date: 'desc'
			}
		});

		return json(records);
	} catch (error) {
		console.error('Error fetching snow removal records:', error);
		return json({ error: 'Failed to fetch records' }, { status: 500 });
	}
};

// 新しい記録を作成
export const POST: RequestHandler = async ({ request }) => {
	try {
		const data = await request.json();

		// 入力値の検証
		if (!data.area || !data.snowDepth || !data.timeSpent) {
			return json({ error: '必須項目が入力されていません' }, { status: 400 });
		}

		// 数値の検証
		if (data.area <= 0 || data.snowDepth <= 0 || data.timeSpent <= 0) {
			return json({ error: '入力値は0より大きい値を入力してください' }, { status: 400 });
		}

		const record = await prisma.snowRemovalRecord.create({
			data: {
				userId: 1, // 現在は固定値、後で認証システムと連携
				date: new Date(),
				area: Number(data.area),
				snowDepth: Number(data.snowDepth),
				timeSpent: Number(data.timeSpent),
				co2Reduction: calculateCO2Reduction(
					Number(data.area),
					Number(data.snowDepth),
					Number(data.timeSpent)
				)
			}
		});

		return json(record);
	} catch (error) {
		console.error('Error creating snow removal record:', error);
		return json({ error: '記録の保存に失敗しました' }, { status: 500 });
	}
};

// CO2削減量の計算関数
function calculateCO2Reduction(area: number, snowDepth: number, timeSpent: number): number {
	// 仮の計算式：面積 × 深さ × 作業時間 × 0.001
	// 実際の計算式は要件に応じて調整が必要
	return Number((area * snowDepth * timeSpent * 0.001).toFixed(2));
}
