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

		const records = await prisma.aCCO2Record.findMany({
			where: {
				userId: 1,
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
		console.error('Error fetching AC CO2 records:', error);
		return json({ error: 'Failed to fetch records' }, { status: 500 });
	}
};

// 新しい記録を作成
export const POST: RequestHandler = async ({ request }) => {
	try {
		const data = await request.json();

		// 入力値の検証
		if (!data.usageHours || !data.powerConsumption || !data.temperature) {
			return json({ error: '必須項目が入力されていません' }, { status: 400 });
		}

		// 数値の検証
		if (data.usageHours <= 0 || data.powerConsumption <= 0) {
			return json({ error: '入力値は0より大きい値を入力してください' }, { status: 400 });
		}

		// 温度の範囲検証
		if (data.temperature < 16 || data.temperature > 32) {
			return json({ error: '温度は16℃から32℃の範囲で入力してください' }, { status: 400 });
		}

		// 日付の設定
		const targetDate = new Date();
		targetDate.setHours(0, 0, 0, 0);

		// 同じ日のレコードを検索
		const existingRecord = await prisma.aCCO2Record.findFirst({
			where: {
				userId: 1,
				date: {
					equals: targetDate
				}
			}
		});

		const co2Emission = calculateCO2Emission(
			Number(data.usageHours),
			Number(data.powerConsumption)
		);

		let record;
		if (existingRecord) {
			// 既存のレコードを更新
			record = await prisma.aCCO2Record.update({
				where: {
					id: existingRecord.id
				},
				data: {
					usageHours: Number(data.usageHours),
					powerConsumption: Number(data.powerConsumption),
					temperature: Number(data.temperature),
					co2Emission: co2Emission
				}
			});
		} else {
			// 新規レコードを作成
			record = await prisma.aCCO2Record.create({
				data: {
					userId: 1,
					date: targetDate,
					usageHours: Number(data.usageHours),
					powerConsumption: Number(data.powerConsumption),
					temperature: Number(data.temperature),
					co2Emission: co2Emission
				}
			});
		}

		return json(record);
	} catch (error) {
		console.error('Error creating/updating AC CO2 record:', error);
		return json({ error: '記録の保存に失敗しました' }, { status: 500 });
	}
};

// CO2排出量の計算関数
function calculateCO2Emission(usageHours: number, powerConsumption: number): number {
	// 電力のCO2排出係数 (kg-CO2/kWh) - 日本の平均的な値
	const electricityEmissionFactor = 0.457;

	// CO2排出量(kg-CO2) = 使用時間(h) × 消費電力(kW) × CO2排出係数(kg-CO2/kWh)
	const co2Emission = usageHours * powerConsumption * electricityEmissionFactor;

	return Number(co2Emission.toFixed(2));
}
