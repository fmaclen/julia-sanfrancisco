<main class="main">
	<slot />
</main>

<style lang="scss">
	main.main {
		display: grid;
		grid-template-rows: max-content auto max-content;
		box-sizing: border-box;
		position: relative;
		gap: 24px;
		padding-block: 24px;
		height: 100%;
		width: 100%;
	}
</style>
