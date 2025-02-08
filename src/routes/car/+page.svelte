<script lang="ts">
	import { onMount } from 'svelte';

	let distance = 0; // km
	let fuelEfficiency = 0; // km/L
	let fuelType = 'regular'; // regular, premium, diesel
	let isSubmitting = false;
	let error: string | null = null;
	let successMessage: string | null = null;
	let records: Array<{
		monthlyDistance: number;
		fuelEfficiency: number;
		fuelType: string;
		co2Emission: number;
		date: string;
	}> = [];

	// 本日の記録を取得
	async function fetchTodayRecords() {
		try {
			const response = await fetch('/api/car-co2');
			if (!response.ok) throw new Error('Failed to fetch records');
			records = await response.json();
		} catch (e) {
			console.error('Error fetching records:', e);
			error = '記録の取得に失敗しました';
		}
	}

	// 記録の保存
	async function handleSubmit() {
		isSubmitting = true;
		error = null;
		successMessage = null;

		try {
			const response = await fetch('/api/car-co2', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					distance,
					fuelEfficiency,
					fuelType
				})
			});

			if (!response.ok) throw new Error('Failed to save record');

			const result = await response.json();
			successMessage = '記録を保存しました';
			// フォームをリセット
			distance = 0;
			fuelEfficiency = 0;
			// 記録を再取得
			await fetchTodayRecords();
		} catch (e) {
			error = '記録の保存に失敗しました';
			console.error(e);
		} finally {
			isSubmitting = false;
		}
	}

	onMount(() => {
		fetchTodayRecords();
	});
</script>

<div class="content">
	<h1>自動車利用記録</h1>

	<!-- 本日の記録一覧 -->
	{#if records.length > 0}
		<section class="today-records">
			<h2>本日の記録</h2>
			<div class="records-list">
				{#each records as record}
					<div class="record-item">
						<div class="record-details">
							<span>走行距離: {record.monthlyDistance}km</span>
							<span>燃費: {record.fuelEfficiency}km/L</span>
							<span
								>燃料: {record.fuelType === 'regular'
									? 'レギュラー'
									: record.fuelType === 'premium'
										? 'ハイオク'
										: '軽油'}</span
							>
						</div>
						<div class="co2-emission">
							CO2排出量: {record.co2Emission.toFixed(2)}kg
						</div>
					</div>
				{/each}
			</div>
		</section>
	{/if}

	<form on:submit|preventDefault={handleSubmit} class="record-form">
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
				min="0"
				step="0.1"
				required
			/>
		</div>

		<div class="form-group">
			<label for="fuelType">燃料タイプ</label>
			<select id="fuelType" bind:value={fuelType} required>
				<option value="regular">レギュラーガソリン</option>
				<option value="premium">ハイオクガソリン</option>
				<option value="diesel">軽油</option>
			</select>
		</div>

		<div class="result-section">
			<h2>CO2排出予測</h2>
			<p class="co2-result">
				{((distance / fuelEfficiency) * (fuelType === 'diesel' ? 2.58 : 2.32)).toFixed(2)}
				<span class="unit">kg</span>
			</p>
			<p class="note">※ この値は概算です</p>
		</div>

		{#if error}
			<div class="error-message">
				{error}
			</div>
		{/if}

		{#if successMessage}
			<div class="success-message">
				{successMessage}
			</div>
		{/if}

		<button type="submit" class="submit-button" disabled={isSubmitting}>
			{isSubmitting ? '保存中...' : '記録を保存'}
		</button>
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

	.today-records {
		margin-bottom: 2rem;
		padding: 1.5rem;
		background: var(--snow-white);
		border-radius: 8px;
		box-shadow: 0 2px 4px var(--shadow-blue);
	}

	.records-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.record-item {
		padding: 1rem;
		background: var(--ice-blue);
		border-radius: 4px;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.record-details {
		display: flex;
		gap: 1rem;
	}

	.co2-emission {
		font-weight: bold;
		color: var(--glacier-blue);
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
		box-shadow: 0 0 0 3px var(--shadow-blue);
	}

	.result-section {
		margin: 2rem 0;
		padding: 1.5rem;
		background: var(--ice-blue);
		border-radius: 8px;
		text-align: center;
	}

	.co2-result {
		font-size: 2.5rem;
		font-weight: bold;
		color: var(--glacier-blue);
		margin: 1rem 0;
		text-shadow: 1px 1px 2px var(--shadow-blue);
	}

	.note {
		font-size: 0.9rem;
		color: var(--frost-gray);
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
		transform: translateY(-2px);
		box-shadow: 0 4px 12px var(--shadow-blue);
	}

	.submit-button:disabled {
		opacity: 0.7;
		cursor: not-allowed;
		transform: none;
	}

	.error-message {
		background-color: #fee2e2;
		color: #dc2626;
		padding: 1rem;
		border-radius: 4px;
		margin-bottom: 1rem;
	}

	.success-message {
		background-color: #dcfce7;
		color: #16a34a;
		padding: 1rem;
		border-radius: 4px;
		margin-bottom: 1rem;
	}
</style>
