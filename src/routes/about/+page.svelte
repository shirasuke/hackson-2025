<script lang="ts">
	let snowRemovalArea = 0; // m²
	let snowDepth = 0; // cm
	let timeSpent = 0; // 分

	function calculateCO2Reduction() {
		// 仮の計算式：実際の計算式は後で実装
		const co2Reduction = (snowRemovalArea * snowDepth * timeSpent) / 1000;
		return co2Reduction.toFixed(2);
	}

	function handleSubmit() {
		// フォーム送信時の処理を後で実装
		console.log('記録を保存します');
	}
</script>

<svelte:head>
	<title>雪かき活動記録</title>
	<meta name="description" content="雪かき活動によるCO2削減効果の記録" />
</svelte:head>

<div class="content">
	<h1>雪かき活動記録</h1>

	<form on:submit|preventDefault={handleSubmit} class="record-form">
		<div class="form-group">
			<label for="snowRemovalArea">
				雪かきを行った面積
				<span class="unit">（m²）</span>
			</label>
			<input
				type="number"
				id="snowRemovalArea"
				bind:value={snowRemovalArea}
				min="0"
				step="0.1"
				required
			/>
		</div>

		<div class="form-group">
			<label for="snowDepth">
				雪の深さ
				<span class="unit">（cm）</span>
			</label>
			<input type="number" id="snowDepth" bind:value={snowDepth} min="0" step="0.1" required />
		</div>

		<div class="form-group">
			<label for="timeSpent">
				作業時間
				<span class="unit">（分）</span>
			</label>
			<input type="number" id="timeSpent" bind:value={timeSpent} min="0" required />
		</div>

		<div class="result-section">
			<h2>CO2削減効果</h2>
			<p class="co2-result">
				{calculateCO2Reduction()}
				<span class="unit">kg</span>
			</p>
			<p class="note">※ この値は概算です</p>
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

	.note {
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
