// src/routes/api/daily-summary/+server.ts
import { json } from '@sveltejs/kit';
import { prisma } from '$lib/prisma';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	try {
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		const tomorrow = new Date(today);
		tomorrow.setDate(tomorrow.getDate() + 1);

		const [carEmissions, acEmissions, snowRemovals] = await Promise.all([
			// 自動車のCO2排出量
			prisma.carCO2Record.findMany({
				where: {
					targetMonth: {
						gte: today,
						lt: tomorrow
					}
				}
			}),

			// エアコンのCO2排出量
			prisma.aCCO2Record.findMany({
				where: {
					date: {
						gte: today,
						lt: tomorrow
					}
				}
			}),

			// 雪かきによるCO2削減量
			prisma.snowRemovalRecord.findMany({
				where: {
					date: {
						gte: today,
						lt: tomorrow
					}
				}
			})
		]);

		// 活動記録の集計
		const activities = [
			...snowRemovals.map((record) => ({
				name: '雪かき',
				reduction: record.co2Reduction
			})),
			...carEmissions.map((record) => ({
				name: '自動車',
				emission: record.co2Emission
			})),
			...acEmissions.map((record) => ({
				name: 'エアコン',
				emission: record.co2Emission
			}))
		];

		const todayReduction = snowRemovals.reduce((sum, record) => sum + record.co2Reduction, 0);
		const todayEmission =
			carEmissions.reduce((sum, record) => sum + record.co2Emission, 0) +
			acEmissions.reduce((sum, record) => sum + record.co2Emission, 0);

		return json({
			todayReduction,
			todayEmission,
			netReduction: todayReduction - todayEmission,
			activities
		});
	} catch (error) {
		console.error('Error fetching daily summary:', error);
		return json({ error: 'Failed to fetch daily summary' }, { status: 500 });
	}
};
