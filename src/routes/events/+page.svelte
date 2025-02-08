<script lang="ts">
	type Event = {
		id: number;
		title: string;
		description: string;
		date: string;
		location: string;
		organizer: string;
		contact: string;
	};

	// モックデータを直接定義
	const events: Event[] = [
		{
			id: 1,
			title: '冬の省エネ講座',
			description:
				'寒い冬を快適に過ごしながら、エネルギー消費を抑える方法を学びます。断熱対策や暖房の効率的な使用方法など、実践的なテクニックを紹介します。',
			date: '2024-02-20',
			location: '札幌市環境プラザ',
			organizer: '札幌環境活動推進協議会',
			contact: 'eco@example.com'
		},
		{
			id: 2,
			title: '雪かきボランティア募集',
			description:
				'高齢者世帯の雪かき支援を行います。地域コミュニティの助け合いを通じて、冬の生活をサポートしましょう。道具は主催者が用意します。',
			date: '2024-02-25',
			location: '札幌市北区北24条駅前広場',
			organizer: '北区町内会連合会',
			contact: 'volunteer@example.com'
		},
		{
			id: 3,
			title: 'エコドライブ講習会',
			description:
				'冬道での安全運転とCO2削減を両立するエコドライブのコツを、実践を交えて学びます。燃費向上テクニックも紹介します。',
			date: '2024-03-05',
			location: '札幌市自動車学校',
			organizer: '北海道運輸局',
			contact: 'drive@example.com'
		},
		{
			id: 4,
			title: '春の省エネ住宅見学会',
			description:
				'高断熱・高気密の省エネ住宅を見学できます。暖房費を大幅に削減しながら快適に暮らす工夫を、実際の住宅で体感してください。',
			date: '2024-03-15',
			location: '札幌市厚別区もみじ台',
			organizer: '北海道住宅協会',
			contact: 'house@example.com'
		}
	];
</script>

<div class="content">
	<h1>イベント掲示板</h1>

	<div class="actions">
		<a href="/events/new" class="new-event-button">新規イベントを投稿</a>
	</div>

	<div class="events-grid">
		{#each events as event}
			<div class="event-card">
				<h2>{event.title}</h2>
				<div class="event-details">
					<div class="detail-item">
						<span class="label">開催日:</span>
						<span class="value">{new Date(event.date).toLocaleDateString('ja-JP')}</span>
					</div>
					<div class="detail-item">
						<span class="label">場所:</span>
						<span class="value">{event.location}</span>
					</div>
					<div class="detail-item">
						<span class="label">主催:</span>
						<span class="value">{event.organizer}</span>
					</div>
				</div>
				<p class="description">{event.description}</p>
				<div class="contact-info">
					<span class="label">連絡先:</span>
					<span class="value">{event.contact}</span>
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.content {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
	}

	h1 {
		color: var(--deep-blue);
		text-align: center;
		margin-bottom: 2rem;
	}

	.actions {
		margin-bottom: 2rem;
		text-align: right;
	}

	.new-event-button {
		display: inline-block;
		padding: 0.8rem 1.5rem;
		background: var(--glacier-blue);
		color: var(--snow-white);
		text-decoration: none;
		border-radius: 6px;
		font-weight: bold;
		transition: all 0.2s ease;
	}

	.new-event-button:hover {
		background: var(--deep-blue);
		transform: translateY(-2px);
		box-shadow: 0 4px 12px var(--shadow-blue);
	}

	.events-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 2rem;
	}

	.event-card {
		background: var(--snow-white);
		border-radius: 12px;
		padding: 1.5rem;
		box-shadow: 0 4px 12px var(--shadow-blue);
		transition: transform 0.2s ease;
	}

	.event-card:hover {
		transform: translateY(-4px);
	}

	.event-card h2 {
		color: var(--deep-blue);
		margin: 0 0 1rem 0;
		font-size: 1.4rem;
	}

	.event-details {
		margin-bottom: 1rem;
	}

	.detail-item {
		margin-bottom: 0.5rem;
	}

	.label {
		color: var(--frost-gray);
		font-size: 0.9rem;
		margin-right: 0.5rem;
	}

	.value {
		color: var(--deep-blue);
		font-weight: 500;
	}

	.description {
		color: var(--deep-blue);
		margin: 1rem 0;
		line-height: 1.6;
	}

	.contact-info {
		margin-top: 1rem;
		padding-top: 1rem;
		border-top: 1px solid var(--ice-blue);
	}
</style>
