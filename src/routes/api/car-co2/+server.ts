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

		const records = await prisma.carCO2Record.findMany({
			where: {
				targetMonth: {
					gte: today,
					lt: tomorrow
				}
			},
			orderBy: {
				targetMonth: 'desc'
			}
		});

		return json(records);
	} catch (error) {
		console.error('Error fetching car CO2 records:', error);
		return json({ error: 'Failed to fetch records' }, { status: 500 });
	}
};

// 新しい記録を作成
export const POST: RequestHandler = async ({ request }) => {
	try {
		const data = await request.json();

		// 入力値の検証
		if (!data.distance || !data.fuelEfficiency || !data.fuelType) {
			return json({ error: '必須項目が入力されていません' }, { status: 400 });
		}

		// 数値の検証
		if (data.distance <= 0 || data.fuelEfficiency <= 0) {
			return json({ error: '入力値は0より大きい値を入力してください' }, { status: 400 });
		}

		// 燃料タイプの検証
		const validFuelTypes = ['regular', 'premium', 'diesel'];
		if (!validFuelTypes.includes(data.fuelType)) {
			return json({ error: '無効な燃料タイプです' }, { status: 400 });
		}

		// 本日の日付を設定
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		// 同じ日のレコードを検索
		const existingRecord = await prisma.carCO2Record.findFirst({
			where: {
				userId: 1,
				targetMonth: {
					equals: today
				}
			}
		});

		const co2Emission = calculateCO2Emission(
			Number(data.distance),
			Number(data.fuelEfficiency),
			data.fuelType
		);

		let record;
		if (existingRecord) {
			// 既存のレコードを更新
			record = await prisma.carCO2Record.update({
				where: {
					id: existingRecord.id
				},
				data: {
					monthlyDistance: Number(data.distance),
					fuelEfficiency: Number(data.fuelEfficiency),
					fuelType: data.fuelType,
					co2Emission: co2Emission
				}
			});
		} else {
			// 新規レコードを作成
			record = await prisma.carCO2Record.create({
				data: {
					userId: 1, // 現在は固定値、後で認証システムと連携
					targetMonth: today,
					monthlyDistance: Number(data.distance),
					fuelEfficiency: Number(data.fuelEfficiency),
					fuelType: data.fuelType,
					co2Emission: co2Emission
				}
			});
		}

		return json(record);
	} catch (error) {
		console.error('Error creating/updating car CO2 record:', error);
		return json({ error: '記録の保存に失敗しました' }, { status: 500 });
	}
};

// CO2排出量の計算関数
function calculateCO2Emission(distance: number, fuelEfficiency: number, fuelType: string): number {
	// 燃料タイプごとのCO2排出係数 (kg-CO2/L)
	const fuelEmissionFactors = {
		regular: 2.32, // レギュラーガソリン
		premium: 2.32, // ハイオクガソリン
		diesel: 2.58 // 軽油
	};

	// 燃料消費量(L) = 走行距離(km) ÷ 燃費(km/L)
	const fuelConsumption = distance / fuelEfficiency;

	// CO2排出量(kg-CO2) = 燃料消費量(L) × CO2排出係数(kg-CO2/L)
	const co2Emission =
		fuelConsumption * fuelEmissionFactors[fuelType as keyof typeof fuelEmissionFactors];

	return Number(co2Emission.toFixed(2));
}
