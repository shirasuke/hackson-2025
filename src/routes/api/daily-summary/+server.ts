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

		// 月ごとのエアコン標準CO2排出量（kg-CO2/日）- 北海道地域
		const monthlyACEmissions: Record<number, number> = {
			1: 5.8, // 1月: 暖房最大使用（厳寒期）
			2: 5.5, // 2月: 暖房最大使用（厳寒期）
			3: 4.2, // 3月: 暖房使用（残寒期）
			4: 2.5, // 4月: 暖房少なめ
			5: 1.0, // 5月: 暖房必要に応じて
			6: 0.2, // 6月: ほぼ未使用
			7: 0.8, // 7月: 冷房少なめ
			8: 1.2, // 8月: 冷房使用（盛夏期）
			9: 0.5, // 9月: 冷房必要に応じて
			10: 1.5, // 10月: 暖房少なめ（初冬）
			11: 3.5, // 11月: 暖房使用増加
			12: 5.0 // 12月: 暖房多用（厳寒期）
		};

		// 一般的な排出量（kg-CO2/日）
		const standardDailyEmission = {
			car: 5.2, // 自動車による平均的な1日あたりのCO2排出量
			ac: monthlyACEmissions[today.getMonth() + 1] // 現在の月のエアコン排出量
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
			standardDailyEmission, // 標準値も返す
			currentMonth: today.getMonth() + 1 // 現在の月も返す
		});
	} catch (error) {
		console.error('Error fetching daily summary:', error);
		return json({ error: 'Failed to fetch daily summary' }, { status: 500 });
	}
};
