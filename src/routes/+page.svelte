<script lang="ts">
	// 天気情報の状態管理
	type Weather = {
		temperature: string;
		condition: string;
		humidity: string;
	};

	let weather: Weather = {
		temperature: '--',
		condition: '読み込み中...',
		humidity: '--'
	};

	// CO2削減の集計データ
	type Activity = {
		name: string;
		reduction: number;
	};

	type CO2Data = {
		todayReduction: number;
		monthlyReduction: number;
		monthlyTarget: number;
		activities: Activity[];
	};

	let co2Data: CO2Data = {
		todayReduction: 0,
		monthlyReduction: 0,
		monthlyTarget: 133.9,
		activities: []
	};

	// 進捗率の計算
	$: progressPercentage = (co2Data.monthlyReduction / co2Data.monthlyTarget) * 100;

	// 後でAPIから天気情報を取得する関数
	async function fetchWeatherData() {
		// TODO: 実際の天気APIとの連携
		// 仮のデータをセット
		weather = {
			temperature: '4',
			condition: '晴れ',
			humidity: '45'
		};
	}

	// 後でデータベースからCO2削減データを取得する関数
	async function fetchCO2Data() {
		// TODO: 実際のデータベースとの連携
		// 仮のデータをセット
		co2Data = {
			todayReduction: 2.5,
			monthlyReduction: 45.6,
			monthlyTarget: 133.9,
			activities: [
				{ name: '雪かき', reduction: 1.2 },
				{ name: 'エアコン調整', reduction: 1.3 }
			]
		};
	}
</script>

<svelte:head>
	<title>HOME - CO2削減活動ダッシュボード</title>
	<meta name="description" content="CO2削減活動の概要と天気情報" />
</svelte:head>

<main class="container">
	<div class="grid">
		<!-- 天気情報セクション -->
		<section class="weather-section">
			<h2>今日の天気</h2>
			<div class="weather-content">
				<div class="weather-main">
					<div class="temperature">
						<span class="value">{weather.temperature}</span>
						<span class="unit">℃</span>
					</div>
					<div class="condition">{weather.condition}</div>
				</div>
				<div class="weather-details">
					<div class="humidity">
						<span class="label">湿度</span>
						<span class="value">{weather.humidity}%</span>
					</div>
				</div>
			</div>
		</section>

		<!-- 本日の記録セクション -->
		<section class="daily-record">
			<h2>本日の記録</h2>
			<div class="record-content">
				<div class="co2-reduction">
					<h3>CO2削減量</h3>
					<p class="reduction-value">{co2Data.todayReduction} kg</p>
				</div>
				<div class="activities">
					<h3>活動記録</h3>
					<ul>
						{#each co2Data.activities as activity}
							<li>
								<span class="activity-name">{activity.name}</span>
								<span class="activity-value">-{activity.reduction} kg</span>
							</li>
						{/each}
					</ul>
				</div>
			</div>
		</section>

		<!-- 月間目標セクション -->
		<section class="monthly-target">
			<h2>月間目標達成状況</h2>
			<div class="target-content">
				<div class="progress-bar">
					<div class="progress-fill" style="width: {Math.min(progressPercentage, 100)}%" />
				</div>
				<p class="progress-text">
					{co2Data.monthlyReduction} / {co2Data.monthlyTarget} kg （{progressPercentage.toFixed(
						1
					)}%）
				</p>
			</div>
		</section>
	</div>
</main>

<style>
	/* 雪国テーマのカラーパレット */
	:root {
		--snow-white: #ffffff;
		--ice-blue: #e8f1f5;
		--glacier-blue: #005c8a;
		--deep-blue: #003559;
		--frost-gray: #7c98ab;
		--shadow-blue: rgba(0, 53, 89, 0.1);
	}

	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
		background-color: var(--ice-blue);
		min-height: 100vh;
	}

	.grid {
		display: grid;
		gap: 2rem;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
	}

	section {
		background: var(--snow-white);
		border-radius: 12px;
		padding: 1.5rem;
		box-shadow: 0 4px 12px var(--shadow-blue);
		transition: transform 0.2s ease;
	}

	section:hover {
		transform: translateY(-2px);
	}

	h2 {
		margin: 0 0 1rem 0;
		font-size: 1.5rem;
		color: var(--deep-blue);
		border-bottom: 2px solid var(--glacier-blue);
		padding-bottom: 0.5rem;
	}

	h3 {
		font-size: 1.1rem;
		color: var(--glacier-blue);
		margin-bottom: 0.5rem;
	}

	.weather-content {
		text-align: center;
		padding: 1rem;
		background: linear-gradient(to bottom, var(--ice-blue), var(--snow-white));
		border-radius: 8px;
	}

	.temperature {
		font-size: 3.5rem;
		font-weight: bold;
		color: var(--glacier-blue);
		text-shadow: 2px 2px 4px var(--shadow-blue);
	}

	.temperature .unit {
		font-size: 1.8rem;
		margin-left: 0.2rem;
		opacity: 0.8;
	}

	.condition {
		font-size: 1.4rem;
		margin: 0.5rem 0;
		color: var(--deep-blue);
	}

	.weather-details {
		margin-top: 1rem;
		padding-top: 1rem;
		border-top: 1px solid var(--ice-blue);
	}

	.humidity {
		display: flex;
		justify-content: space-between;
		padding: 0.5rem;
		color: var(--frost-gray);
	}

	.co2-reduction {
		text-align: center;
		margin-bottom: 1.5rem;
		padding: 1rem;
		background: var(--ice-blue);
		border-radius: 8px;
	}

	.reduction-value {
		font-size: 2.5rem;
		font-weight: bold;
		color: var(--glacier-blue);
		text-shadow: 1px 1px 2px var(--shadow-blue);
	}

	.activities ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.activities li {
		display: flex;
		justify-content: space-between;
		padding: 0.8rem;
		border-bottom: 1px solid var(--ice-blue);
		transition: background-color 0.2s ease;
	}

	.activities li:hover {
		background-color: var(--ice-blue);
		border-radius: 4px;
	}

	.activity-name {
		color: var(--deep-blue);
	}

	.activity-value {
		color: var(--glacier-blue);
		font-weight: bold;
	}

	.monthly-target {
		grid-column: 1 / -1;
	}

	.progress-bar {
		width: 100%;
		height: 24px;
		background: var(--ice-blue);
		border-radius: 12px;
		overflow: hidden;
		margin: 1rem 0;
		box-shadow: inset 0 2px 4px var(--shadow-blue);
	}

	.progress-fill {
		height: 100%;
		background: linear-gradient(to right, var(--glacier-blue), var(--deep-blue));
		transition: width 0.3s ease;
	}

	.progress-text {
		text-align: center;
		font-size: 1.1rem;
		color: var(--frost-gray);
		margin-top: 0.5rem;
	}
</style>
