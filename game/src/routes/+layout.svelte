<main class="main">
	<slot />
</main>

<style lang="scss">
	:global(body) {
		--color-neutral-50: #ffffff;
		--color-neutral-100: #e3e8e6;
		--color-neutral-200: #a4b0ac;
		--color-neutral-300: #6d7471;
		--color-neutral-400: #4f5452;
		--color-neutral-500: #3b3f3e;
		--color-neutral-600: #2d2f2e;
		--color-neutral-700: #232424;
		--color-neutral-800: #1e1e1e;
		--color-neutral-900: #181818;
		--color-neutral-950: #141414;
		--color-neutral-1000: #0f0f0f;

    font-family: 'Mona Sans';
    margin: unset;
    color: var(--color-neutral-100);
    background-color: var(--color-neutral-900);
	}

	main.main {
		width: 100%;
		max-width: 640px;
		margin-inline: auto;
	}
</style>
