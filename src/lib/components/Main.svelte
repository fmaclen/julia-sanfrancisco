<main class="main">
	<slot />
</main>

<style lang="scss">
	main.main {
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		position: relative;
		gap: var(--spacing-l);
		height: 100%;
		width: 100%;
		z-index: 0;
		max-height: 100dvh;
		overflow-y: scroll;
		background-color: #000;
	}
</style>
