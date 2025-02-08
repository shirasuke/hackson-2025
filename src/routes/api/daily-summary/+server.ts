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

		// 月初めの日付を取得
		const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
		// 月末の日付を取得
		const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

		const [todayCarEmissions, todayAcEmissions, monthlyCarEmissions, monthlyAcEmissions] =
			await Promise.all([
				// 本日の自動車のCO2排出量
				prisma.carCO2Record.findMany({
					where: {
						targetMonth: {
							gte: today,
							lt: tomorrow
						}
					}
				}),

				// 本日のエアコンのCO2排出量
				prisma.aCCO2Record.findMany({
					where: {
						date: {
							gte: today,
							lt: tomorrow
						}
					}
				}),

				// 今月の自動車のCO2排出量
				prisma.carCO2Record.findMany({
					where: {
						targetMonth: {
							gte: startOfMonth,
							lt: endOfMonth
						}
					}
				}),

				// 今月のエアコンのCO2排出量
				prisma.aCCO2Record.findMany({
					where: {
						date: {
							gte: startOfMonth,
							lt: endOfMonth
						}
					}
				})
			]);

		// 本日の活動記録の集計
		const activities = [
			...todayCarEmissions.map((record) => ({
				name: '自動車',
				emission: record.co2Emission
			})),
			...todayAcEmissions.map((record) => ({
				name: 'エアコン',
				emission: record.co2Emission
			}))
		];

		// 今日の合計排出量
		const todayEmission =
			todayCarEmissions.reduce((sum, record) => sum + record.co2Emission, 0) +
			todayAcEmissions.reduce((sum, record) => sum + record.co2Emission, 0);

		// 一般的な月間平均排出量（kg-CO2/日）
		// 参考値：一般的な世帯の1日あたりのCO2排出量
		const standardDailyEmission = {
			car: 5.2, // 自動車による平均的な1日あたりのCO2排出量
			ac: 2.8 // エアコンによる平均的な1日あたりのCO2排出量
		};
		const monthlyAverageEmission = standardDailyEmission.car + standardDailyEmission.ac;

		// 平均との差分（パーセンテージ）
		const comparisonPercentage =
			monthlyAverageEmission > 0
				? ((todayEmission - monthlyAverageEmission) / monthlyAverageEmission) * 100
				: 0;

		// 月間の合計排出量
		const monthlyTotalEmission =
			monthlyCarEmissions.reduce((sum, record) => sum + record.co2Emission, 0) +
			monthlyAcEmissions.reduce((sum, record) => sum + record.co2Emission, 0);

		return json({
			todayEmission,
			monthlyAverageEmission,
			comparisonPercentage,
			activities,
			monthlyTotalEmission,
			standardDailyEmission // 標準値も返す
		});
	} catch (error) {
		console.error('Error fetching daily summary:', error);
		return json({ error: 'Failed to fetch daily summary' }, { status: 500 });
	}
};
