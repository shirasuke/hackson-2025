<script lang="ts">
	import { onMount } from 'svelte';
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

	let todayEmission = 0;
	let monthlyAverageEmission = 0;
	let comparisonPercentage = 0;
	let activities: Array<{
		name: string;
		emission: number;
	}> = [];
	let monthlyTotalEmission = 0;
	let standardDailyEmission: {
		car: number;
		ac: number;
	} | null = null;

	async function fetchDailySummary() {
		try {
			const response = await fetch('/api/daily-summary');
			if (!response.ok) throw new Error('Failed to fetch summary');
			const data = await response.json();
			todayEmission = data.todayEmission;
			monthlyAverageEmission = data.monthlyAverageEmission;
			comparisonPercentage = data.comparisonPercentage;
			activities = data.activities;
			monthlyTotalEmission = data.monthlyTotalEmission;
			standardDailyEmission = data.standardDailyEmission;
		} catch (e) {
			console.error('Error fetching daily summary:', e);
		}
	}

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

	onMount(() => {
		fetchDailySummary();
		fetchWeatherData();
	});
</script>

<svelte:head>
	<title>HOME - CO2排出量ダッシュボード</title>
	<meta name="description" content="CO2排出量の概要と天気情報" />
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

		<!-- CO2排出量サマリー -->
		<section class="summary-section">
			<h2>CO2排出量サマリー</h2>
			<div class="summary-card">
				<h3>本日の排出量</h3>
				<p class="emission-value">{todayEmission.toFixed(2)} kg-CO2</p>

				<div class="comparison">
					<h3>一般的な排出量との比較</h3>
					<p class="average">
						一般的な1日あたりの排出量: {monthlyAverageEmission.toFixed(2)} kg-CO2/日
					</p>
					<div class="percentage {comparisonPercentage > 0 ? 'over' : 'under'}">
						{#if comparisonPercentage > 0}
							<span>一般的な排出量より {comparisonPercentage.toFixed(1)}% 多い</span>
						{:else if comparisonPercentage < 0}
							<span>一般的な排出量より {Math.abs(comparisonPercentage).toFixed(1)}% 少ない</span>
						{:else}
							<span>一般的な排出量と同じ</span>
						{/if}
					</div>
					<div class="emission-details">
						<p>自動車: {standardDailyEmission?.car.toFixed(2)} kg-CO2/日</p>
						<p>エアコン: {standardDailyEmission?.ac.toFixed(2)} kg-CO2/日</p>
					</div>
				</div>

				<div class="activities">
					<h3>活動別内訳</h3>
					{#each activities as activity}
						<div class="activity-item">
							<span class="activity-name">{activity.name}</span>
							<span class="activity-value">{activity.emission.toFixed(2)} kg-CO2</span>
						</div>
					{/each}
				</div>

				<div class="monthly-total">
					<h3>今月の合計排出量</h3>
					<p class="total-value">{monthlyTotalEmission.toFixed(2)} kg-CO2</p>
				</div>
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
		padding: 1rem;
		background-color: var(--ice-blue);
		min-height: 100vh;
	}

	.grid {
		display: grid;
		gap: 1rem;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
	}

	section {
		background: var(--snow-white);
		border-radius: 12px;
		padding: 1.25rem;
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
		margin-bottom: 0.5rem;
	}

	.emission-value {
		font-size: 2rem;
		color: #e74c3c;
		margin: 0.5rem 0;
		text-align: center;
		font-weight: bold;
	}

	.net-value {
		font-size: 1.4rem;
		color: var(--deep-blue);
		font-weight: bold;
	}

	.activity-value.reduction {
		color: var(--glacier-blue);
	}

	.activity-value.emission {
		color: #e74c3c;
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

	.loading {
		text-align: center;
		color: var(--frost-gray);
		padding: 1rem;
	}

	footer {
		text-align: center;
		padding: 2rem;
		background-color: var(--deep-blue);
		color: var(--snow-white);
		margin-top: 2rem;
	}

	footer p {
		margin: 0;
		font-size: 1.1rem;
	}

	.content {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem;
	}

	h1 {
		color: var(--deep-blue);
		text-align: center;
		margin-bottom: 2rem;
	}

	.summary-card {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.comparison {
		background: var(--ice-blue);
		padding: 1rem;
		border-radius: 8px;
	}

	.average {
		font-size: 0.9rem;
		color: var(--deep-blue);
		margin: 0.5rem 0;
	}

	.percentage {
		font-size: 1.1rem;
		font-weight: bold;
		padding: 0.5rem;
		border-radius: 4px;
		margin: 0.5rem 0;
		text-align: center;
	}

	.percentage.over {
		background-color: rgba(231, 76, 60, 0.1);
		color: #e74c3c;
	}

	.percentage.under {
		background-color: rgba(46, 204, 113, 0.1);
		color: #27ae60;
	}

	.emission-details {
		margin-top: 0.5rem;
		font-size: 0.9rem;
		color: var(--frost-gray);
	}

	.emission-details p {
		margin: 0.25rem 0;
	}

	.activities {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.activity-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.75rem;
		background: var(--ice-blue);
		border-radius: 6px;
		transition: background-color 0.2s ease;
	}

	.activity-item:hover {
		background: #dde9ef;
	}

	.activity-name {
		color: var(--deep-blue);
		font-weight: 500;
	}

	.activity-value {
		color: var(--glacier-blue);
		font-weight: bold;
	}

	.monthly-total {
		text-align: center;
		padding: 1rem;
		background: var(--deep-blue);
		border-radius: 8px;
		color: var(--snow-white);
	}

	.monthly-total h3 {
		color: var(--snow-white);
		margin-bottom: 0.5rem;
	}

	.total-value {
		font-size: 1.5rem;
		font-weight: bold;
		margin: 0;
	}

	@media (max-width: 768px) {
		.container {
			padding: 0.5rem;
		}

		.grid {
			gap: 0.75rem;
		}

		section {
			padding: 1rem;
		}

		.emission-value {
			font-size: 1.75rem;
		}

		.activity-item {
			padding: 0.5rem;
			font-size: 0.9rem;
		}
	}

	@media (max-width: 480px) {
		.container {
			padding: 0.25rem;
		}

		h2 {
			font-size: 1.25rem;
		}

		h3 {
			font-size: 1rem;
		}

		.emission-value {
			font-size: 1.5rem;
		}

		.percentage {
			font-size: 1rem;
		}

		.emission-details {
			font-size: 0.8rem;
		}

		.activity-item {
			font-size: 0.85rem;
		}

		.total-value {
			font-size: 1.25rem;
		}
	}
</style>
