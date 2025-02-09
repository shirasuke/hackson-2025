import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
	// 既存のデータをクリア
	await prisma.event.deleteMany({});

	// テストユーザーの作成
	const user1 = await prisma.user.upsert({
		where: { email: 'test1@example.com' },
		update: {},
		create: {
			username: 'yamada',
			email: 'test1@example.com',
			passwordHash: 'test123' // 本番環境では適切なハッシュ化が必要
		}
	});

	const user2 = await prisma.user.upsert({
		where: { email: 'test2@example.com' },
		update: {},
		create: {
			username: 'suzuki',
			email: 'test2@example.com',
			passwordHash: 'test123'
		}
	});

	// 車のCO2記録
	await prisma.carCO2Record.createMany({
		data: [
			{
				userId: user1.id,
				targetMonth: new Date('2024-02-01'),
				monthlyDistance: 500,
				fuelEfficiency: 15,
				fuelType: 'gasoline',
				co2Emission: 87.5
			},
			{
				userId: user2.id,
				targetMonth: new Date('2024-02-01'),
				monthlyDistance: 300,
				fuelEfficiency: 20,
				fuelType: 'gasoline',
				co2Emission: 35.0
			}
		]
	});

	// エアコンのCO2記録
	await prisma.aCCO2Record.createMany({
		data: [
			{
				userId: user1.id,
				date: new Date('2024-02-05'),
				usageHours: 8,
				powerConsumption: 1.5,
				temperature: 25,
				co2Emission: 12.0
			},
			{
				userId: user2.id,
				date: new Date('2024-02-05'),
				usageHours: 6,
				powerConsumption: 1.2,
				temperature: 23,
				co2Emission: 7.2
			}
		]
	});

	// 除雪のCO2記録
	await prisma.snowRemovalRecord.createMany({
		data: [
			{
				userId: user1.id,
				date: new Date('2024-02-10'),
				area: 50,
				snowDepth: 15,
				timeSpent: 60,
				co2Reduction: 5.0
			},
			{
				userId: user2.id,
				date: new Date('2024-02-10'),
				area: 30,
				snowDepth: 10,
				timeSpent: 45,
				co2Reduction: 3.0
			}
		]
	});

	// イベントの作成
	await prisma.event.create({
		data: {
			title: 'エコドライブ講習会',
			description: '効率的な運転方法を学ぶ講習会です',
			date: new Date('2024-02-20'),
			location: '市民会館',
			organizer: '環境保護団体',
			contact: 'contact@example.com'
		}
	});

	console.log('シードデータの作成が完了しました');
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
