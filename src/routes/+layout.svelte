<script lang="ts">
	import Header from './Header.svelte';
	import '../app.css';

	let { children } = $props();
</script>

<div class="app">
	<Header />

	<main>
		{@render children()}
	</main>

	<footer>
		<div class="footer-content">
			<p class="footer-text">CO2log <span class="footer-subtitle">〜コツログ〜</span></p>
			<p class="footer-copyright">© 2024 CO2Log All Rights Reserved.</p>
		</div>
	</footer>
</div>

<style>
	:root {
		--snow-white: #ffffff;
		--ice-blue: #e8f1f5;
		--glacier-blue: #005c8a;
		--deep-blue: #003559;
		--frost-gray: #7c98ab;
		--shadow-blue: rgba(0, 53, 89, 0.1);
	}

	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		max-width: 64rem;
		margin: 0 auto;
		box-sizing: border-box;
	}

	footer {
		background: var(--deep-blue);
		border-top: 1px solid var(--glacier-blue);
		padding: 1rem 0;
		margin-top: 1rem;
		box-shadow: 0 -2px 8px var(--shadow-blue);
	}

	.footer-content {
		max-width: 64rem;
		margin: 0 auto;
		padding: 0 1rem;
		text-align: center;
	}

	.footer-text {
		font-size: 1.2rem;
		font-weight: 700;
		color: var(--snow-white);
		margin: 0 0 0.3rem 0;
		font-family: 'M PLUS Rounded 1c', sans-serif;
		letter-spacing: 0.03em;
	}

	.footer-subtitle {
		font-size: 0.9rem;
		color: var(--ice-blue);
		font-weight: 500;
		margin-left: 0.5rem;
		font-family: 'M PLUS Rounded 1c', sans-serif;
	}

	.footer-copyright {
		font-size: 0.75rem;
		color: var(--frost-gray);
		margin: 0;
		font-weight: 400;
	}

	@media (max-width: 768px) {
		main {
			padding: 0.5rem;
		}

		footer {
			padding: 0.8rem 0;
		}
	}

	@media (max-width: 480px) {
		main {
			padding: 0.5rem;
			font-size: 0.9rem;
		}

		.footer-text {
			font-size: 1.1rem;
		}

		.footer-subtitle {
			font-size: 0.8rem;
		}

		.footer-copyright {
			font-size: 0.7rem;
		}
	}
</style>
