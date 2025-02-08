import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
	// 既存のデータをクリア
	await prisma.event.deleteMany({});

	// イベントのモックデータを作成
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
		},
		{
			title: '春の省エネ住宅見学会',
			description:
				'高断熱・高気密の省エネ住宅を見学できます。暖房費を大幅に削減しながら快適に暮らす工夫を、実際の住宅で体感してください。',
			date: new Date('2024-03-15'),
			location: '札幌市厚別区もみじ台',
			organizer: '北海道住宅協会',
			contact: 'house@example.com'
		}
	];

	for (const event of events) {
		await prisma.event.create({
			data: event
		});
	}

	console.log('モックデータの作成が完了しました');
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
