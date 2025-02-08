// src/routes/api/co2-records/+server.ts
import { json } from '@sveltejs/kit';
import { prisma } from '$lib/prisma';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	const userId = parseInt(url.searchParams.get('userId') ?? '1');
	const month = url.searchParams.get('month');

	try {
		const [carRecords, acRecords, snowRecords] = await Promise.all([
			prisma.carCO2Record.findMany({
				where: {
					userId,
					targetMonth: {
						gte: new Date(month + '-01'),
						lt: new Date(new Date(month + '-01').setMonth(new Date(month + '-01').getMonth() + 1))
					}
				}
			}),
			prisma.aCCO2Record.findMany({
				where: {
					userId,
					date: {
						gte: new Date(month + '-01'),
						lt: new Date(new Date(month + '-01').setMonth(new Date(month + '-01').getMonth() + 1))
					}
				}
			}),
			prisma.snowRemovalRecord.findMany({
				where: {
					userId,
					date: {
						gte: new Date(month + '-01'),
						lt: new Date(new Date(month + '-01').setMonth(new Date(month + '-01').getMonth() + 1))
					}
				}
			})
		]);

		return json({
			carRecords,
			acRecords,
			snowRecords
		});
	} catch (error) {
		console.error('Error fetching CO2 records:', error);
		return json({ error: 'Failed to fetch CO2 records' }, { status: 500 });
	}
};
