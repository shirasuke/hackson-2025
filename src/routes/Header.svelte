<script lang="ts">
	import { page } from '$app/state';
</script>

<header>
	<nav>
		<svg viewBox="0 0 2 3" aria-hidden="true">
			<path d="M0,0 L1,2 C1.5,3 1.5,3 2,3 L2,0 Z" />
		</svg>
		<ul>
			<li aria-current={page.url.pathname === '/' ? 'page' : undefined}>
				<a href="/">Home</a>
			</li>
			<li aria-current={page.url.pathname === '/top' ? 'page' : undefined}>
				<a href="/top">エアコン</a>
			</li>
			<li aria-current={page.url.pathname === '/about' ? 'page' : undefined}>
				<a href="/about">雪かき</a>
			</li>
			<li aria-current={page.url.pathname === '/car' ? 'page' : undefined}>
				<a href="/car">自動車</a>
			</li>
		</ul>
		<svg viewBox="0 0 2 3" aria-hidden="true">
			<path d="M0,0 L0,3 C0.5,3 0.5,3 1,2 L2,0 Z" />
		</svg>
	</nav>
</header>

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

	header {
		display: flex;
		justify-content: center;
		background: var(--deep-blue);
		padding: 0 1rem;
		box-shadow: 0 2px 8px var(--shadow-blue);
	}

	nav {
		display: flex;
		justify-content: center;
		--background: var(--glacier-blue);
		max-width: 1200px;
		width: 100%;
	}

	svg {
		width: 2em;
		height: 3em;
		display: block;
	}

	path {
		fill: var(--background);
	}

	ul {
		position: relative;
		padding: 0;
		margin: 0;
		height: 3em;
		display: flex;
		justify-content: center;
		align-items: center;
		list-style: none;
		background: var(--background);
		background-size: contain;
		border-radius: 0 0 8px 8px;
	}

	li {
		position: relative;
		height: 100%;
	}

	li[aria-current='page']::before {
		--size: 6px;
		content: '';
		width: 0;
		height: 0;
		position: absolute;
		top: 0;
		left: calc(50% - var(--size));
		border: var(--size) solid transparent;
		border-top: var(--size) solid var(--ice-blue);
	}

	nav a {
		display: flex;
		height: 100%;
		align-items: center;
		padding: 0 1.5rem;
		color: var(--snow-white);
		font-weight: 700;
		font-size: 0.9rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		text-decoration: none;
		transition: all 0.2s ease;
	}

	a:hover {
		color: var(--ice-blue);
		background-color: rgba(255, 255, 255, 0.1);
	}

	li[aria-current='page'] a {
		color: var(--ice-blue);
		background-color: rgba(255, 255, 255, 0.15);
	}
</style>
