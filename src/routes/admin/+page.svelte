<script lang="ts">
	import { onMount } from 'svelte';

	type User = {
		id: number;
		username: string;
		email: string;
	};

	type UserCO2Summary = {
		userId: string;
		totalCO2: number;
		carCO2: number;
		acCO2: number;
	};

	type EventParticipation = {
		eventId: string;
		eventName: string;
		participantCount: number;
		date: string;
	};

	let users: User[] = [];
	let selectedUserId: number | null = null;
	let userSummary: UserCO2Summary | null = null;
	let eventParticipations: EventParticipation[] = [];
	let currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM形式
	let loading = false;
	let totalUsersCO2Summary = {
		totalCO2: 0,
		carCO2: 0,
		acCO2: 0
	};

	let participations: Array<{
		id: number;
		status: string;
		user: {
			username: string;
			email: string;
		};
		event: {
			title: string;
			date: string;
		};
	}> = [];

	onMount(async () => {
		await fetchUsers();
		await fetchEventParticipations();
		await fetchAllUsersCO2Summary();
		await fetchParticipations();
	});

	async function fetchUsers() {
		try {
			loading = true;
			const response = await fetch('/api/admin/users');
			if (response.ok) {
				users = await response.json();
			} else {
				console.error('ユーザー一覧の取得に失敗しました');
			}
		} catch (error) {
			console.error('ユーザー一覧の取得中にエラーが発生しました:', error);
		} finally {
			loading = false;
		}
	}

	async function fetchUserSummary(userId: number) {
		try {
			loading = true;
			const response = await fetch(`/api/admin/user-summaries/${userId}?month=${currentMonth}`);
			if (response.ok) {
				userSummary = await response.json();
			} else {
				console.error('ユーザーサマリーの取得に失敗しました');
				userSummary = null;
			}
		} catch (error) {
			console.error('ユーザーサマリーの取得中にエラーが発生しました:', error);
			userSummary = null;
		} finally {
			loading = false;
		}
	}

	async function fetchAllUsersCO2Summary() {
		try {
			loading = true;
			const response = await fetch(`/api/admin/user-summaries?month=${currentMonth}`);
			if (response.ok) {
				const summaries: UserCO2Summary[] = await response.json();
				totalUsersCO2Summary = summaries.reduce(
					(acc, curr) => ({
						totalCO2: acc.totalCO2 + curr.totalCO2,
						carCO2: acc.carCO2 + curr.carCO2,
						acCO2: acc.acCO2 + curr.acCO2
					}),
					{ totalCO2: 0, carCO2: 0, acCO2: 0 }
				);
			} else {
				console.error('全ユーザーのCO2サマリー取得に失敗しました');
			}
		} catch (error) {
			console.error('全ユーザーのCO2サマリー取得中にエラーが発生しました:', error);
		} finally {
			loading = false;
		}
	}

	async function fetchEventParticipations() {
		const response = await fetch(`/api/admin/event-participations?month=${currentMonth}`);
		if (response.ok) {
			eventParticipations = await response.json();
		}
	}

	async function fetchParticipations() {
		try {
			const response = await fetch('/api/admin/event-participations');
			if (!response.ok) throw new Error('Failed to fetch participations');
			participations = await response.json();
		} catch (e) {
			console.error('Error fetching participations:', e);
		}
	}

	async function updateParticipationStatus(
		participationId: number,
		status: 'approved' | 'rejected'
	) {
		try {
			const response = await fetch('/api/admin/event-participations', {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ participationId, status })
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || 'Failed to update status');
			}

			// 更新後のデータを再取得
			await fetchParticipations();
		} catch (e) {
			console.error('Error updating participation status:', e);
			alert('ステータスの更新に失敗しました。');
		}
	}

	async function handleUserSelect(userId: number) {
		selectedUserId = userId;
		await fetchUserSummary(userId);
	}

	async function handleMonthChange() {
		if (selectedUserId) {
			fetchUserSummary(selectedUserId);
		}
		fetchEventParticipations();
		fetchAllUsersCO2Summary();
	}
</script>

<div class="min-h-screen bg-gray-50">
	<div class="container mx-auto px-4 py-8">
		<h1 class="mb-8 text-3xl font-bold text-gray-900">管理者ダッシュボード</h1>

		<div class="grid gap-8">
			<!-- 全体のCO2排出量サマリーセクション -->
			<section class="rounded-lg bg-white p-6 shadow-sm">
				<div class="mb-6 flex items-center justify-between">
					<h2 class="text-2xl font-semibold text-gray-800">全体のCO2排出量サマリー</h2>
					<div class="text-lg text-gray-600">
						{new Date(currentMonth + '-01').toLocaleDateString('ja-JP', {
							year: 'numeric',
							month: 'long'
						})}
					</div>
				</div>
				{#if loading}
					<div class="flex h-40 items-center justify-center">
						<div
							class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-green-500 border-t-transparent"
						></div>
					</div>
				{:else}
					<div class="grid grid-cols-1 gap-6 md:grid-cols-3">
						<div
							class="rounded-lg bg-gradient-to-br from-green-500 to-green-600 p-4 text-white shadow-sm"
						>
							<div class="text-sm opacity-90">総CO2排出量</div>
							<div class="text-2xl font-bold">{totalUsersCO2Summary.totalCO2.toFixed(2)} kg</div>
						</div>
						<div
							class="rounded-lg bg-gradient-to-br from-green-500 to-green-600 p-4 text-white shadow-sm"
						>
							<div class="text-sm opacity-90">車両</div>
							<div class="text-2xl font-bold">{totalUsersCO2Summary.carCO2.toFixed(2)} kg</div>
						</div>
						<div
							class="rounded-lg bg-gradient-to-br from-green-500 to-green-600 p-4 text-white shadow-sm"
						>
							<div class="text-sm opacity-90">エアコン</div>
							<div class="text-2xl font-bold">{totalUsersCO2Summary.acCO2.toFixed(2)} kg</div>
						</div>
					</div>
				{/if}
			</section>

			<!-- ユーザー一覧セクション -->
			<section class="rounded-lg bg-white p-6 shadow-sm">
				<div class="mb-6 flex items-center justify-between">
					<h2 class="text-2xl font-semibold text-gray-800">ユーザー一覧</h2>
					<input
						type="month"
						bind:value={currentMonth}
						on:change={handleMonthChange}
						class="rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
					/>
				</div>

				{#if loading}
					<div class="flex h-40 items-center justify-center">
						<div
							class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"
						></div>
					</div>
				{:else}
					<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
						{#each users as user}
							<button
								class="flex flex-col rounded-lg border p-4 text-left transition-all hover:border-blue-500 hover:bg-blue-50 {selectedUserId ===
								user.id
									? 'border-blue-500 bg-blue-50 shadow-sm'
									: 'border-gray-200'}"
								on:click={() => handleUserSelect(user.id)}
							>
								<div class="font-semibold text-gray-900">{user.username}</div>
								<div class="text-sm text-gray-600">{user.email}</div>
							</button>
						{/each}
					</div>
				{/if}
			</section>

			<!-- CO2排出量サマリーセクション -->
			{#if selectedUserId && userSummary}
				<section class="rounded-lg bg-white p-6 shadow-sm">
					<h2 class="mb-6 text-2xl font-semibold text-gray-800">CO2排出量サマリー</h2>
					<div class="grid grid-cols-1 gap-6 md:grid-cols-3">
						<div
							class="rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 p-4 text-white shadow-sm"
						>
							<div class="text-sm opacity-90">総CO2排出量</div>
							<div class="text-2xl font-bold">{userSummary.totalCO2.toFixed(2)} kg</div>
						</div>
						<div
							class="rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 p-4 text-white shadow-sm"
						>
							<div class="text-sm opacity-90">車両</div>
							<div class="text-2xl font-bold">{userSummary.carCO2.toFixed(2)} kg</div>
						</div>
						<div
							class="rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 p-4 text-white shadow-sm"
						>
							<div class="text-sm opacity-90">エアコン</div>
							<div class="text-2xl font-bold">{userSummary.acCO2.toFixed(2)} kg</div>
						</div>
					</div>
				</section>
			{/if}

			<!-- イベント参加状況セクション -->
			<section class="rounded-lg bg-white p-6 shadow-sm">
				<h2 class="mb-6 text-2xl font-semibold text-gray-800">イベント参加状況</h2>
				<div class="overflow-hidden rounded-lg border border-gray-200">
					<table class="min-w-full divide-y divide-gray-200">
						<thead class="bg-gray-50">
							<tr>
								<th
									class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
								>
									イベント名
								</th>
								<th
									class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
								>
									開催日
								</th>
								<th
									class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
								>
									参加者
								</th>
								<th
									class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
								>
									ステータス
								</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-gray-200 bg-white">
							{#each participations as participation}
								<tr class="hover:bg-gray-50">
									<td class="px-6 py-4 whitespace-nowrap">
										<div class="font-medium text-gray-900">{participation.event.title}</div>
									</td>
									<td class="px-6 py-4 whitespace-nowrap">
										{new Date(participation.event.date).toLocaleDateString('ja-JP')}
									</td>
									<td class="px-6 py-4">
										<div class="text-sm">
											<div class="font-medium text-gray-900">{participation.user.username}</div>
											<div class="text-gray-500">{participation.user.email}</div>
										</div>
									</td>
									<td class="px-6 py-4 whitespace-nowrap">
										<span
											class="inline-flex rounded-full px-2 text-xs leading-5 font-semibold {participation.status ===
											'pending'
												? 'bg-yellow-100 text-yellow-800'
												: participation.status === 'approved'
													? 'bg-green-100 text-green-800'
													: 'bg-red-100 text-red-800'}"
										>
											{#if participation.status === 'pending'}
												審査中
											{:else if participation.status === 'approved'}
												承認済み
											{:else if participation.status === 'rejected'}
												却下
											{/if}
										</span>
										{#if participation.status === 'pending'}
											<div class="mt-2 flex space-x-2">
												<button
													class="inline-flex items-center rounded border border-transparent bg-green-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none"
													on:click={() => updateParticipationStatus(participation.id, 'approved')}
												>
													承認
												</button>
												<button
													class="inline-flex items-center rounded border border-transparent bg-red-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none"
													on:click={() => updateParticipationStatus(participation.id, 'rejected')}
												>
													却下
												</button>
											</div>
										{/if}
									</td>
								</tr>
							{:else}
								<tr>
									<td colspan="4" class="px-6 py-4 text-center text-gray-500">
										参加申請はありません。
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</section>

			<!-- イベント参加申請管理セクション -->
			<section class="rounded-lg bg-white p-6 shadow-sm">
				<h2 class="mb-6 text-2xl font-semibold text-gray-800">イベント参加申請管理</h2>
				<div class="participations-list">
					{#each participations as participation}
						<div class="participation-card">
							<div class="participation-info">
								<h3>{participation.event.title}</h3>
								<p>参加者: {participation.user.username} ({participation.user.email})</p>
								<p>開催日: {new Date(participation.event.date).toLocaleDateString('ja-JP')}</p>
								<p>
									ステータス:
									<span class="status-badge {participation.status}">
										{#if participation.status === 'pending'}
											審査中
										{:else if participation.status === 'approved'}
											承認済み
										{:else if participation.status === 'rejected'}
											却下
										{/if}
									</span>
								</p>
							</div>

							{#if participation.status === 'pending'}
								<div class="action-buttons">
									<button
										class="approve-button"
										on:click={() => updateParticipationStatus(participation.id, 'approved')}
									>
										承認
									</button>
									<button
										class="reject-button"
										on:click={() => updateParticipationStatus(participation.id, 'rejected')}
									>
										却下
									</button>
								</div>
							{/if}
						</div>
					{:else}
						<p>参加申請はありません。</p>
					{/each}
				</div>
			</section>
		</div>
	</div>
</div>

<style>
	.admin-container {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem;
	}

	h2 {
		color: var(--deep-blue);
		margin-bottom: 2rem;
	}

	.participations-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.participation-card {
		background: white;
		border-radius: 8px;
		padding: 1.5rem;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.participation-info {
		flex: 1;
	}

	.participation-info h3 {
		margin: 0 0 0.5rem 0;
		color: var(--deep-blue);
	}

	.participation-info p {
		margin: 0.25rem 0;
		color: #666;
	}

	.status-badge {
		display: inline-block;
		padding: 0.25rem 0.75rem;
		border-radius: 1rem;
		font-size: 0.875rem;
		font-weight: 500;
	}

	.status-badge.pending {
		background-color: #fef3c7;
		color: #92400e;
	}

	.status-badge.approved {
		background-color: #d1fae5;
		color: #065f46;
	}

	.status-badge.rejected {
		background-color: #fee2e2;
		color: #991b1b;
	}

	.action-buttons {
		display: flex;
		gap: 0.5rem;
	}

	button {
		padding: 0.5rem 1rem;
		border-radius: 4px;
		border: none;
		font-weight: 500;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.approve-button {
		background-color: #059669;
		color: white;
	}

	.approve-button:hover {
		background-color: #047857;
	}

	.reject-button {
		background-color: #dc2626;
		color: white;
	}

	.reject-button:hover {
		background-color: #b91c1c;
	}
</style>
