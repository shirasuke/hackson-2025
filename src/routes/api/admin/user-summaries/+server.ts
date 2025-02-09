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
		// ユーザー一覧を取得
		const users = await prisma.user.findMany();

		// 各ユーザーのCO2データを取得
		const userSummaries = await Promise.all(
			users.map(async (user) => {
				const [carCO2, acCO2, snowRemovalCO2] = await Promise.all([
					prisma.carCO2Record.aggregate({
						where: {
							userId: user.id,
							targetMonth: {
								gte: startDate,
								lte: endDate
							}
						},
						_sum: {
							co2Emission: true
						}
					}),
					prisma.aCCO2Record.aggregate({
						where: {
							userId: user.id,
							date: {
								gte: startDate,
								lte: endDate
							}
						},
						_sum: {
							co2Emission: true
						}
					}),
					prisma.snowRemovalRecord.aggregate({
						where: {
							userId: user.id,
							date: {
								gte: startDate,
								lte: endDate
							}
						},
						_sum: {
							co2Reduction: true
						}
					})
				]);

				const carTotal = carCO2._sum.co2Emission || 0;
				const acTotal = acCO2._sum.co2Emission || 0;
				const snowTotal = snowRemovalCO2._sum.co2Reduction || 0;

				return {
					userId: user.id,
					totalCO2: carTotal + acTotal - snowTotal, // 除雪による削減量を引く
					carCO2: carTotal,
					acCO2: acTotal,
					snowRemovalCO2: snowTotal
				};
			})
		);

		return json(userSummaries);
	} catch (error) {
		console.error('ユーザーサマリーの取得中にエラーが発生しました:', error);
		return json({ error: 'サーバーエラーが発生しました' }, { status: 500 });
	}
};
