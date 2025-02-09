<script lang="ts">
	import { page } from '$app/state';
	let isMenuOpen = false;

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}

	function closeMenu() {
		isMenuOpen = false;
	}
</script>

<header>
	<nav>
		<div class="mobile-menu-button" on:click={toggleMenu}>
			<span class="hamburger" class:open={isMenuOpen}></span>
		</div>
		<svg viewBox="0 0 2 3" aria-hidden="true" class="desktop-only">
			<path d="M0,0 L1,2 C1.5,3 1.5,3 2,3 L2,0 Z" />
		</svg>
		<ul class:open={isMenuOpen}>
			<li aria-current={page.url.pathname === '/' ? 'page' : undefined}>
				<a href="/" on:click={closeMenu}>Home</a>
			</li>
			<li aria-current={page.url.pathname === '/ac' ? 'page' : undefined}>
				<a href="/ac" on:click={closeMenu}>エアコン</a>
			</li>
			<li aria-current={page.url.pathname === '/car' ? 'page' : undefined}>
				<a href="/car" on:click={closeMenu}>自動車</a>
			</li>
			<!-- <li aria-current={page.url.pathname === '/about' ? 'page' : undefined}>
				<a href="/about">雪かき</a>
			</li> -->
			<li aria-current={page.url.pathname.startsWith('/events') ? 'page' : undefined}>
				<a href="/events" on:click={closeMenu}>イベント</a>
			</li>
		</ul>
		<svg viewBox="0 0 2 3" aria-hidden="true" class="desktop-only">
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

	.mobile-menu-button {
		display: none;
		padding: 1rem;
		cursor: pointer;
		z-index: 100;
	}

	.hamburger {
		display: block;
		width: 24px;
		height: 2px;
		background: var(--snow-white);
		position: relative;
		transition: all 0.3s ease-in-out;
	}

	.hamburger::before,
	.hamburger::after {
		content: '';
		position: absolute;
		width: 24px;
		height: 2px;
		background: var(--snow-white);
		transition: all 0.3s ease-in-out;
	}

	.hamburger::before {
		transform: translateY(-8px);
	}

	.hamburger::after {
		transform: translateY(8px);
	}

	.hamburger.open {
		background: transparent;
	}

	.hamburger.open::before {
		transform: rotate(45deg);
	}

	.hamburger.open::after {
		transform: rotate(-45deg);
	}

	@media (max-width: 768px) {
		.mobile-menu-button {
			display: block;
		}

		.desktop-only {
			display: none;
		}

		nav {
			padding: 0;
		}

		ul {
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			flex-direction: column;
			background: var(--deep-blue);
			transform: translateX(-100%);
			transition: transform 0.3s ease-in-out;
			height: 100vh;
			padding-top: 4rem;
		}

		ul.open {
			transform: translateX(0);
		}

		li {
			height: auto;
			margin: 1rem 0;
		}

		nav a {
			padding: 1rem 2rem;
			font-size: 1.2rem;
		}

		li[aria-current='page']::before {
			display: none;
		}
	}
</style>
