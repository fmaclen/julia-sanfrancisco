<main class="main">
	<slot />
</main>

<style lang="scss">
	main.main {
		display: grid;
		grid-template-rows: max-content auto auto max-content;
		box-sizing: border-box;
		position: relative;
		gap: var(--spacing-l);
		height: 100%;
		width: 100%;
		z-index: 0;
		background-color: #000;
	}
</style>
