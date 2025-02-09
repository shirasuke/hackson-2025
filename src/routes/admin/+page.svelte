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

	onMount(async () => {
		await fetchUsers();
		await fetchEventParticipations();
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

	async function fetchEventParticipations() {
		const response = await fetch(`/api/admin/event-participations?month=${currentMonth}`);
		if (response.ok) {
			eventParticipations = await response.json();
		}
	}

	async function handleUserSelect(userId: number) {
		selectedUserId = userId;
		await fetchUserSummary(userId);
	}

	function handleMonthChange() {
		if (selectedUserId) {
			fetchUserSummary(selectedUserId);
		}
		fetchEventParticipations();
	}
</script>

<div class="min-h-screen bg-gray-50">
	<div class="container mx-auto px-4 py-8">
		<h1 class="mb-8 text-3xl font-bold text-gray-900">管理者ダッシュボード</h1>

		<div class="grid gap-8">
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
									>イベント名</th
								>
								<th
									class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
									>開催日</th
								>
								<th
									class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
									>参加者数</th
								>
							</tr>
						</thead>
						<tbody class="divide-y divide-gray-200 bg-white">
							{#each eventParticipations as event}
								<tr class="hover:bg-gray-50">
									<td class="px-6 py-4 whitespace-nowrap">{event.eventName}</td>
									<td class="px-6 py-4 whitespace-nowrap"
										>{new Date(event.date).toLocaleDateString('ja-JP')}</td
									>
									<td class="px-6 py-4 whitespace-nowrap">{event.participantCount}人</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</section>
		</div>
	</div>
</div>
