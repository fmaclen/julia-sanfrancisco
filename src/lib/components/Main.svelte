<main class="main">
	<div class="main__container main__container--header">
		<slot name="header" />
	</div>

	<slot />

	<div class="main__container main__container--footer">
		<slot name="footer" />
	</div>
</main>

<style lang="scss">
	main.main {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		position: relative;
		height: 100%;
	}

	div.main__container {
		position: relative;
		z-index: 10;

		&--header {
			grid-area: header;
		}

		&--footer {
			grid-area: footer;
		}
	}
</style>
