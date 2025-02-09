<script lang="ts">
	import { onMount } from 'svelte';

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
	let hasEarnedStamp = false;
	let totalStamps = 10;
	let earnedStamps = 0;

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
			hasEarnedStamp = comparisonPercentage < 0;
			// TODO: APIから獲得済みスタンプ数を取得する
			earnedStamps = 5; // 仮の値：実際のAPIからの取得に置き換える
		} catch (e) {
			console.error('Error fetching daily summary:', e);
		}
	}

	onMount(() => {
		fetchDailySummary();
	});

	function getStampStatus(index: number) {
		return index < earnedStamps;
	}
</script>

<svelte:head>
	<title>HOME - CO2排出量ダッシュボード</title>
	<meta name="description" content="CO2排出量の概要" />
</svelte:head>

<main class="container">
	<div class="grid">
		<!-- スタンプコレクションセクション -->
		<section class="stamp-collection-container">
			<h2>エコスタンプ</h2>
			<div class="stamp-progress">
				<span class="progress-text">{earnedStamps}/{totalStamps} 個達成</span>
			</div>
			<div class="stamps-grid">
				{#each Array(totalStamps) as _, i}
					<div class="stamp-slot {getStampStatus(i) ? 'earned' : 'empty'}">
						{#if getStampStatus(i)}
							<div class="stamp-mini" style="animation-delay: {i * 0.1}s">
								<span class="stamp-footprint">👣</span>
							</div>
						{:else}
							<div class="stamp-placeholder">
								<span class="placeholder-text">未達成</span>
							</div>
						{/if}
					</div>
				{/each}
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
		display: flex;
		flex-direction: column;
		gap: 1rem;
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

	.stamp-collection-container {
		background: var(--snow-white);
		border-radius: 12px;
		padding: 1.25rem;
		text-align: center;
		width: 100%;
		max-width: 800px;
		margin: 0 auto;
	}

	.stamp-progress {
		margin-bottom: 1rem;
		text-align: center;
	}

	.progress-text {
		font-size: 1.2rem;
		color: var(--deep-blue);
		font-weight: bold;
	}

	.stamps-grid {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: 0.8rem;
		padding: 1rem;
		background: var(--ice-blue);
		border-radius: 8px;
		max-width: 500px;
		margin: 0 auto;
	}

	.stamp-slot {
		aspect-ratio: 1;
		border-radius: 50%;
		padding: 0.3rem;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--snow-white);
		box-shadow: 0 2px 4px var(--shadow-blue);
	}

	.stamp-mini {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 1.5px solid var(--glacier-blue);
		border-radius: 50%;
		background: rgba(232, 241, 245, 0.8);
		animation: stampPop 0.5s ease-out forwards;
		opacity: 0;
		transform: scale(0);
		transform-origin: center;
	}

	@keyframes stampPop {
		from {
			transform: scale(0) rotate(30deg);
			opacity: 0;
		}
		to {
			transform: scale(1) rotate(0deg);
			opacity: 1;
		}
	}

	.stamp-footprint {
		font-size: 1.4rem;
		transform: rotate(-15deg); /* 足跡を少し傾ける */
		filter: opacity(0.8); /* 少し透明に */
	}

	.stamp-placeholder {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 2px dashed var(--frost-gray);
		border-radius: 50%;
		opacity: 0.5;
	}

	.placeholder-text {
		font-size: 0.6rem;
		color: var(--frost-gray);
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

	.summary-section {
		width: 100%;
		max-width: 800px;
		margin: 0 auto;
	}

	@media (max-width: 768px) {
		.container {
			padding: 0.5rem;
		}

		.stamps-grid {
			max-width: 100%;
			gap: 0.4rem;
			padding: 0.8rem;
		}

		.emission-value {
			font-size: 1.75rem;
		}

		.activity-item {
			padding: 0.5rem;
			font-size: 0.9rem;
		}

		.stamp-footprint {
			font-size: 1.2rem;
		}

		.placeholder-text {
			font-size: 0.5rem;
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
