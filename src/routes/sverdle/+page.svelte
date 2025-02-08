<script lang="ts">
	import { onMount } from 'svelte';

	// 入力値
	let monthlyDistance = 0; // 月間走行距離（km）
	let fuelEfficiency = 15; // 燃費（km/L）
	type FuelType = 'regular' | 'premium' | 'diesel';
	let fuelType: FuelType = 'regular'; // ガソリンタイプ
	let targetMonth = new Date().toISOString().slice(0, 7); // YYYY-MM形式

	// 月間目標値（kg-CO2）
	const monthlyTarget = 133.9; // 自動車の月間CO2排出量目標

	// 燃料タイプごとのCO2排出係数 (kg-CO2/L)
	const fuelEmissionFactors = {
		regular: 2.32, // レギュラーガソリン
		premium: 2.32, // ハイオクガソリン
		diesel: 2.58 // 軽油
	} as const;

	let monthlyPercentage = 0; // 月間目標値に対する割合

	// CO2排出量の計算
	function calculateCO2Emission() {
		const fuelUsed = monthlyDistance / fuelEfficiency; // 使用燃料量(L)
		const emissionFactor = fuelEmissionFactors[fuelType];
		const co2Emission = fuelUsed * emissionFactor;
		return co2Emission.toFixed(2);
	}

	// 目標達成率の更新
	$: {
		const currentEmission = parseFloat(calculateCO2Emission());
		monthlyPercentage = (currentEmission / monthlyTarget) * 100;
	}

	function handleSubmit() {
		// フォーム送信時の処理を後で実装
		console.log('記録を保存します:', {
			targetMonth,
			monthlyDistance,
			fuelEfficiency,
			fuelType,
			co2Emission: calculateCO2Emission()
		});
	}
</script>

<svelte:head>
	<title>自動車CO2排出量記録</title>
	<meta name="description" content="自動車利用によるCO2排出量の記録と分析" />
</svelte:head>

<div class="content">
	<h1>自動車CO2排出量記録</h1>

	<form on:submit|preventDefault={handleSubmit} class="record-form">
		<div class="form-group">
			<label for="targetMonth"> 対象月 </label>
			<input type="month" id="targetMonth" bind:value={targetMonth} required />
		</div>

		<div class="form-group">
			<label for="monthlyDistance">
				月間走行距離
				<span class="unit">（km）</span>
			</label>
			<input
				type="number"
				id="monthlyDistance"
				bind:value={monthlyDistance}
				min="0"
				step="1"
				required
			/>
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
			<h2>月間CO2排出量</h2>
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
					目標値の {monthlyPercentage.toFixed(1)}%
				</p>
				<p class="target-text">
					月間目標: {monthlyTarget} kg-CO2
				</p>
				<p class="note">※ 目標値は一般家庭の自動車による月間CO2排出量の目安です</p>
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
		color: var(--deep-blue);
		margin-bottom: 2rem;
		text-align: center;
	}

	.record-form {
		background: var(--snow-white);
		padding: 2rem;
		border-radius: 12px;
		box-shadow: 0 4px 12px var(--shadow-blue);
	}

	.form-group {
		margin-bottom: 1.5rem;
	}

	label {
		display: block;
		margin-bottom: 0.5rem;
		color: var(--deep-blue);
		font-weight: bold;
	}

	.unit {
		font-size: 0.9em;
		color: var(--frost-gray);
		margin-left: 0.3rem;
	}

	input,
	select {
		width: 100%;
		padding: 0.8rem;
		border: 2px solid var(--ice-blue);
		border-radius: 6px;
		font-size: 1.1rem;
		background-color: var(--snow-white);
		color: var(--deep-blue);
		transition: border-color 0.2s ease;
	}

	input:focus,
	select:focus {
		border-color: var(--glacier-blue);
		outline: none;
	}

	.result-section {
		margin: 2rem 0;
		padding: 1.5rem;
		background: var(--ice-blue);
		border-radius: 8px;
		text-align: center;
	}

	.result-section h2 {
		color: var(--deep-blue);
		margin-bottom: 1rem;
	}

	.co2-result {
		font-size: 2.5rem;
		font-weight: bold;
		color: var(--glacier-blue);
		margin: 1rem 0;
		text-shadow: 1px 1px 2px var(--shadow-blue);
	}

	.monthly-progress {
		margin-top: 2rem;
		padding-top: 1rem;
		border-top: 1px solid var(--glacier-blue);
	}

	.monthly-progress h3 {
		color: var(--deep-blue);
		margin-bottom: 1rem;
	}

	.progress-bar {
		width: 100%;
		height: 24px;
		background: var(--snow-white);
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
		font-size: 1.2rem;
		color: var(--deep-blue);
		margin: 0.5rem 0;
		font-weight: bold;
	}

	.target-text {
		font-size: 1rem;
		color: var(--frost-gray);
	}

	.note {
		font-size: 0.9rem;
		color: var(--frost-gray);
		margin-top: 1rem;
		font-style: italic;
	}

	.submit-button {
		width: 100%;
		padding: 1rem;
		background: linear-gradient(to right, var(--glacier-blue), var(--deep-blue));
		color: var(--snow-white);
		border: none;
		border-radius: 6px;
		font-size: 1.1rem;
		font-weight: bold;
		cursor: pointer;
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease;
	}

	.submit-button:hover {
		transform: translateY(-1px);
		box-shadow: 0 4px 12px var(--shadow-blue);
	}

	.submit-button:active {
		transform: translateY(0);
	}
</style>
