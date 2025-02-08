<script lang="ts">
	import { goto } from '$app/navigation';

	let title = '';
	let description = '';
	let date = '';
	let location = '';
	let organizer = '';
	let contact = '';
	let isSubmitting = false;

	function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		isSubmitting = true;

		// モックデータとして、入力内容をコンソールに出力
		console.log('新規イベント:', {
			title,
			description,
			date,
			location,
			organizer,
			contact
		});

		// 投稿成功を想定して一覧ページに遷移
		goto('/events');
	}
</script>

<div class="content">
	<h1>新規イベントの投稿</h1>

	<form on:submit={handleSubmit} class="event-form">
		<div class="form-group">
			<label for="title">イベント名 <span class="required">*</span></label>
			<input
				type="text"
				id="title"
				bind:value={title}
				required
				placeholder="イベントの名前を入力してください"
			/>
		</div>

		<div class="form-group">
			<label for="date">開催日 <span class="required">*</span></label>
			<input type="date" id="date" bind:value={date} required />
		</div>

		<div class="form-group">
			<label for="location">開催場所 <span class="required">*</span></label>
			<input
				type="text"
				id="location"
				bind:value={location}
				required
				placeholder="開催場所を入力してください"
			/>
		</div>

		<div class="form-group">
			<label for="description">イベントの説明 <span class="required">*</span></label>
			<textarea
				id="description"
				bind:value={description}
				required
				rows="5"
				placeholder="イベントの詳細を入力してください"
			/>
		</div>

		<div class="form-group">
			<label for="organizer">主催者 <span class="required">*</span></label>
			<input
				type="text"
				id="organizer"
				bind:value={organizer}
				required
				placeholder="主催者名を入力してください"
			/>
		</div>

		<div class="form-group">
			<label for="contact">連絡先 <span class="required">*</span></label>
			<input
				type="text"
				id="contact"
				bind:value={contact}
				required
				placeholder="連絡先を入力してください"
			/>
		</div>

		<div class="form-actions">
			<a href="/events" class="cancel-button">キャンセル</a>
			<button type="submit" class="submit-button" disabled={isSubmitting}>
				{isSubmitting ? '投稿中...' : '投稿する'}
			</button>
		</div>
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
		text-align: center;
		margin-bottom: 2rem;
	}

	.event-form {
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

	.required {
		color: #dc2626;
		margin-left: 0.2rem;
	}

	input,
	textarea {
		width: 100%;
		padding: 0.8rem;
		border: 2px solid var(--ice-blue);
		border-radius: 6px;
		font-size: 1rem;
		background-color: var(--snow-white);
		color: var(--deep-blue);
		transition: border-color 0.2s ease;
	}

	input:focus,
	textarea:focus {
		border-color: var(--glacier-blue);
		outline: none;
		box-shadow: 0 0 0 3px var(--shadow-blue);
	}

	textarea {
		resize: vertical;
		min-height: 120px;
	}

	.form-actions {
		display: flex;
		gap: 1rem;
		margin-top: 2rem;
	}

	.submit-button,
	.cancel-button {
		flex: 1;
		padding: 1rem;
		border-radius: 6px;
		font-size: 1rem;
		font-weight: bold;
		text-align: center;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.submit-button {
		background: var(--glacier-blue);
		color: var(--snow-white);
		border: none;
	}

	.submit-button:hover:not(:disabled) {
		background: var(--deep-blue);
		transform: translateY(-2px);
		box-shadow: 0 4px 12px var(--shadow-blue);
	}

	.submit-button:disabled {
		opacity: 0.7;
		cursor: not-allowed;
	}

	.cancel-button {
		background: var(--ice-blue);
		color: var(--deep-blue);
		text-decoration: none;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.cancel-button:hover {
		background: var(--frost-gray);
		color: var(--snow-white);
		transform: translateY(-2px);
		box-shadow: 0 4px 12px var(--shadow-blue);
	}
</style>
