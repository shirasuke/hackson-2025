<script lang="ts">
	import { onMount } from 'svelte';

	// 入力値
	let distance = 0; // km
	let fuelEfficiency = 15; // km/L
	type FuelType = 'regular' | 'premium' | 'diesel';
	let fuelType: FuelType = 'regular'; // ガソリンタイプ
	let date = new Date().toISOString().split('T')[0]; // 今日の日付

	// 月間目標値（kg-CO2）
	const monthlyTarget = 133.9; // 一人当たりの月間CO2排出量目標

	// 燃料タイプごとのCO2排出係数 (kg-CO2/L)
	const fuelEmissionFactors = {
		regular: 2.32, // レギュラーガソリン
		premium: 2.32, // ハイオクガソリン
		diesel: 2.58 // 軽油
	} as const;

	let monthlyTotal = 0; // 月間の合計CO2排出量
	let monthlyPercentage = 0; // 月間目標値に対する割合

	// CO2排出量の計算
	function calculateCO2Emission() {
		const fuelUsed = distance / fuelEfficiency; // 使用燃料量(L)
		const emissionFactor = fuelEmissionFactors[fuelType];
		const co2Emission = fuelUsed * emissionFactor;
		return co2Emission.toFixed(2);
	}

	// 月間合計の更新（実際のアプリではデータベースから取得）
	function updateMonthlyTotal() {
		// 仮の実装：実際にはデータベースから当月のデータを取得
		const currentEmission = parseFloat(calculateCO2Emission());
		monthlyTotal = currentEmission;
		monthlyPercentage = (monthlyTotal / monthlyTarget) * 100;
	}

	// 入力値が変更されたら計算を更新
	$: {
		distance;
		fuelEfficiency;
		fuelType;
		updateMonthlyTotal();
	}

	function handleSubmit() {
		// フォーム送信時の処理を後で実装
		console.log('記録を保存します:', {
			date,
			distance,
			fuelEfficiency,
			fuelType,
			co2Emission: calculateCO2Emission()
		});
	}
</script>

<svelte:head>
	<title>自動車CO2排出量記録</title>
	<meta name="description" content="自動車移動によるCO2排出量の記録と分析" />
</svelte:head>

<div class="content">
	<h1>自動車CO2排出量記録</h1>

	<form on:submit|preventDefault={handleSubmit} class="record-form">
		<div class="form-group">
			<label for="date"> 日付 </label>
			<input type="date" id="date" bind:value={date} required />
		</div>

		<div class="form-group">
			<label for="distance">
				走行距離
				<span class="unit">（km）</span>
			</label>
			<input type="number" id="distance" bind:value={distance} min="0" step="0.1" required />
		</div>

		<div class="form-group">
			<label for="fuelEfficiency">
				燃費
				<span class="unit">（km/L）</span>
			</label>
			<input
				type="number"
				id="fuelEfficiency"
				bind:value={fuelEfficiency}
				min="1"
				step="0.1"
				required
			/>
		</div>

		<div class="form-group">
			<label for="fuelType"> 燃料タイプ </label>
			<select id="fuelType" bind:value={fuelType}>
				<option value="regular">レギュラーガソリン</option>
				<option value="premium">ハイオクガソリン</option>
				<option value="diesel">軽油</option>
			</select>
		</div>

		<div class="result-section">
			<h2>CO2排出量</h2>
			<p class="co2-result">
				{calculateCO2Emission()}
				<span class="unit">kg-CO2</span>
			</p>

			<div class="monthly-progress">
				<h3>月間目標達成状況</h3>
				<div class="progress-bar">
					<div class="progress-fill" style="width: {Math.min(monthlyPercentage, 100)}%" />
				</div>
				<p class="progress-text">
					月間排出量: {monthlyTotal.toFixed(2)} kg-CO2 （目標値の {monthlyPercentage.toFixed(1)}%）
				</p>
				<p class="target-text">
					月間目標: {monthlyTarget} kg-CO2
				</p>
			</div>
		</div>

		<button type="submit" class="submit-button">記録を保存</button>
	</form>
</div>

<style>
	.content {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem;
	}

	h1 {
		color: var(--color-theme-1);
		margin-bottom: 2rem;
		text-align: center;
	}

	.record-form {
		background: white;
		padding: 2rem;
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.form-group {
		margin-bottom: 1.5rem;
	}

	label {
		display: block;
		margin-bottom: 0.5rem;
		color: #2c3e50;
		font-weight: bold;
	}

	.unit {
		font-size: 0.9em;
		color: #666;
		margin-left: 0.3rem;
	}

	input,
	select {
		width: 100%;
		padding: 0.5rem;
		border: 2px solid #ddd;
		border-radius: 4px;
		font-size: 1.1rem;
	}

	input:focus,
	select:focus {
		border-color: var(--color-theme-1);
		outline: none;
	}

	.result-section {
		margin: 2rem 0;
		padding: 1.5rem;
		background: #f8f9fa;
		border-radius: 4px;
		text-align: center;
	}

	.result-section h2 {
		color: #2c3e50;
		margin-bottom: 1rem;
	}

	.co2-result {
		font-size: 2.5rem;
		font-weight: bold;
		color: var(--color-theme-1);
		margin: 1rem 0;
	}

	.monthly-progress {
		margin-top: 2rem;
		padding-top: 1rem;
		border-top: 1px solid #ddd;
	}

	.monthly-progress h3 {
		color: #2c3e50;
		margin-bottom: 1rem;
	}

	.progress-bar {
		width: 100%;
		height: 20px;
		background: #ddd;
		border-radius: 10px;
		overflow: hidden;
		margin: 1rem 0;
	}

	.progress-fill {
		height: 100%;
		background: var(--color-theme-1);
		transition: width 0.3s ease;
	}

	.progress-text {
		font-size: 1.1rem;
		margin: 0.5rem 0;
	}

	.target-text {
		font-size: 0.9rem;
		color: #666;
	}

	.submit-button {
		width: 100%;
		padding: 1rem;
		background-color: var(--color-theme-1);
		color: white;
		border: none;
		border-radius: 4px;
		font-size: 1.1rem;
		font-weight: bold;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.submit-button:hover {
		background-color: var(--color-theme-2);
	}
</style>
