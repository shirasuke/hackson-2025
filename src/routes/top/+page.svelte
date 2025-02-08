<script lang="ts">
	// 入力値
	let usageHours = 0; // 使用時間（時間）
	let powerConsumption = 0.8; // 消費電力（kW）
	let temperature = 25; // 設定温度（℃）
	let date = new Date().toISOString().split('T')[0]; // 今日の日付

	// 月間目標値（kg-CO2）
	const monthlyTarget = 41.7; // エアコンの月間CO2排出量目標

	// CO2排出係数 (kg-CO2/kWh) - 電力の二酸化炭素排出係数
	const CO2_EMISSION_FACTOR = 0.457; // 全国平均値を使用

	let monthlyTotal = 0; // 月間の合計CO2排出量
	let monthlyPercentage = 0; // 月間目標値に対する割合

	// CO2排出量の計算
	function calculateCO2Emission() {
		const energyConsumption = usageHours * powerConsumption; // 消費電力量(kWh)
		const co2Emission = energyConsumption * CO2_EMISSION_FACTOR;
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
		usageHours;
		powerConsumption;
		temperature;
		updateMonthlyTotal();
	}

	function handleSubmit() {
		// フォーム送信時の処理を後で実装
		console.log('記録を保存します:', {
			date,
			usageHours,
			powerConsumption,
			temperature,
			co2Emission: calculateCO2Emission()
		});
	}
</script>

<svelte:head>
	<title>エアコンCO2排出量記録</title>
	<meta name="description" content="エアコン使用によるCO2排出量の記録と分析" />
</svelte:head>

<div class="content">
	<h1>エアコンCO2排出量記録</h1>

	<form on:submit|preventDefault={handleSubmit} class="record-form">
		<div class="form-group">
			<label for="date"> 日付 </label>
			<input type="date" id="date" bind:value={date} required />
		</div>

		<div class="form-group">
			<label for="usageHours">
				使用時間
				<span class="unit">（時間）</span>
			</label>
			<input type="number" id="usageHours" bind:value={usageHours} min="0" step="0.5" required />
		</div>

		<div class="form-group">
			<label for="powerConsumption">
				消費電力
				<span class="unit">（kW）</span>
			</label>
			<input
				type="number"
				id="powerConsumption"
				bind:value={powerConsumption}
				min="0.1"
				step="0.1"
				required
			/>
		</div>

		<div class="form-group">
			<label for="temperature">
				設定温度
				<span class="unit">（℃）</span>
			</label>
			<input type="number" id="temperature" bind:value={temperature} min="16" max="32" required />
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

	input {
		width: 100%;
		padding: 0.5rem;
		border: 2px solid #ddd;
		border-radius: 4px;
		font-size: 1.1rem;
	}

	input:focus {
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
