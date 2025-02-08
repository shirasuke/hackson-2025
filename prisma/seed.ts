import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
	// テストユーザーの作成
	const user = await prisma.user.create({
		data: {
			username: 'testuser',
			email: 'test@example.com',
			passwordHash: 'dummy_hash'
		}
	});

	// 本日の日付を取得
	const today = new Date();
	const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);

	// 雪かき活動のseedデータ
	await prisma.snowRemovalRecord.create({
		data: {
			userId: user.id,
			date: today,
			area: 50.0,
			snowDepth: 15.0,
			timeSpent: 30,
			co2Reduction: 1.2
		}
	});

	// エアコン使用のseedデータ
	await prisma.aCCO2Record.create({
		data: {
			userId: user.id,
			date: today,
			usageHours: 5.0,
			powerConsumption: 0.8,
			temperature: 25,
			co2Emission: 1.8
		}
	});

	// 自動車使用のseedデータ
	await prisma.carCO2Record.create({
		data: {
			userId: user.id,
			targetMonth: thisMonth,
			monthlyDistance: 300.0,
			fuelEfficiency: 15.0,
			fuelType: 'regular',
			co2Emission: 46.4
		}
	});

	// 月間目標のseedデータ
	await prisma.monthlyTarget.create({
		data: {
			userId: user.id,
			targetMonth: thisMonth,
			carTarget: 133.9,
			acTarget: 41.7
		}
	});

	console.log('Seed data has been created');
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
