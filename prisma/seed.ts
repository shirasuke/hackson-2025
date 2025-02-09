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

	// サンプルイベントの作成
	const events = [
		{
			title: '冬の省エネ講座',
			description:
				'寒い冬を快適に過ごしながら、エネルギー消費を抑える方法を学びます。断熱対策や暖房の効率的な使用方法など、実践的なテクニックを紹介します。',
			date: new Date('2024-02-20'),
			location: '札幌市環境プラザ',
			organizer: '札幌環境活動推進協議会',
			contact: 'eco@example.com'
		},
		{
			title: '雪かきボランティア募集',
			description:
				'高齢者世帯の雪かき支援を行います。地域コミュニティの助け合いを通じて、冬の生活をサポートしましょう。道具は主催者が用意します。',
			date: new Date('2024-02-25'),
			location: '札幌市北区北24条駅前広場',
			organizer: '北区町内会連合会',
			contact: 'volunteer@example.com'
		},
		{
			title: 'エコドライブ講習会',
			description:
				'冬道での安全運転とCO2削減を両立するエコドライブのコツを、実践を交えて学びます。燃費向上テクニックも紹介します。',
			date: new Date('2024-03-05'),
			location: '札幌市自動車学校',
			organizer: '北海道運輸局',
			contact: 'drive@example.com'
		}
	];

	for (const eventData of events) {
		await prisma.event.create({
			data: eventData
		});
	}

	console.log('シードデータの投入が完了しました');
}

main()
	.catch((e) => {
		console.error('シードデータの投入中にエラーが発生しました:', e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
