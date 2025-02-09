<script lang="ts">
	import { onMount } from 'svelte';

	type Event = {
		id: number;
		title: string;
		description: string;
		date: string;
		location: string;
		organizer: string;
		contact: string;
		isParticipating: boolean;
	};

	let events: Event[] = [];
	let loading = false;
	let message = { text: '', type: '' };

	function showMessage(text: string, type: 'success' | 'error') {
		message = { text, type };
		setTimeout(() => {
			message = { text: '', type: '' };
		}, 3000);
	}

	async function fetchEvents() {
		try {
			loading = true;
			const response = await fetch('/api/events');
			if (!response.ok) throw new Error('Failed to fetch events');
			events = await response.json();
		} catch (e) {
			console.error('Error fetching events:', e);
			showMessage('イベントの取得に失敗しました。', 'error');
		} finally {
			loading = false;
		}
	}

	async function participateInEvent(eventId: number) {
		try {
			const response = await fetch('/api/events/participation', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ eventId })
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || 'Failed to register for event');
			}

			// 参加登録後、イベント一覧を再取得して表示を更新
			await fetchEvents();
			showMessage('イベントへの参加登録が完了しました！', 'success');
		} catch (e) {
			console.error('Error registering for event:', e);
			showMessage(e instanceof Error ? e.message : 'イベントへの参加登録に失敗しました。', 'error');
		}
	}

	async function cancelParticipation(eventId: number) {
		try {
			const response = await fetch(`/api/events/participation/${eventId}`, {
				method: 'DELETE'
			});

			if (!response.ok) throw new Error('Failed to cancel participation');

			// 参加キャンセル後、イベント一覧を再取得して表示を更新
			await fetchEvents();
			showMessage('イベントの参加をキャンセルしました。', 'success');
		} catch (e) {
			console.error('Error canceling participation:', e);
			showMessage('イベント参加のキャンセルに失敗しました。', 'error');
		}
	}

	onMount(() => {
		fetchEvents();
	});
</script>

<div class="content">
	<h1>イベント掲示板</h1>

	{#if message.text}
		<div class="message {message.type}">
			{message.text}
		</div>
	{/if}

	<div class="actions">
		<a href="/events/new" class="new-event-button">新規イベントを投稿</a>
	</div>

	{#if loading}
		<div class="loading">
			<p>読み込み中...</p>
		</div>
	{:else}
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
					<div class="participation-section">
						{#if event.isParticipating}
							<div class="participation-status">
								<span class="status-badge participating">参加予定</span>
								<button class="cancel-button" on:click={() => cancelParticipation(event.id)}>
									キャンセル
								</button>
							</div>
						{:else}
							<button class="participate-button" on:click={() => participateInEvent(event.id)}>
								参加する
							</button>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	{/if}
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

	.loading {
		text-align: center;
		padding: 2rem;
		color: var(--frost-gray);
	}

	.participation-section {
		margin-top: 1rem;
		padding-top: 1rem;
		border-top: 1px solid var(--ice-blue);
		display: flex;
		justify-content: center;
	}

	.participate-button {
		background: var(--glacier-blue);
		color: var(--snow-white);
		padding: 0.5rem 1.5rem;
		border: none;
		border-radius: 4px;
		font-weight: 500;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.participate-button:hover {
		background: var(--deep-blue);
	}

	.participation-status {
		display: flex;
		gap: 1rem;
		align-items: center;
	}

	.status-badge.participating {
		background-color: #d1fae5;
		color: #065f46;
	}

	.cancel-button {
		background: #ef4444;
		color: white;
		padding: 0.5rem 1rem;
		border: none;
		border-radius: 4px;
		font-weight: 500;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.cancel-button:hover {
		background: #dc2626;
	}

	.message {
		position: fixed;
		top: 20px;
		right: 20px;
		padding: 1rem 2rem;
		border-radius: 8px;
		color: white;
		font-weight: bold;
		animation: slideIn 0.3s ease-out;
		z-index: 1000;
	}

	.message.success {
		background-color: #10b981;
	}

	.message.error {
		background-color: #ef4444;
	}

	@keyframes slideIn {
		from {
			transform: translateX(100%);
			opacity: 0;
		}
		to {
			transform: translateX(0);
			opacity: 1;
		}
	}
</style>
