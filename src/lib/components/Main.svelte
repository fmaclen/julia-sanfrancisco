<script lang="ts">
	interface Props {
		header?: import('svelte').Snippet;
		children?: import('svelte').Snippet;
		footer?: import('svelte').Snippet;
	}

	let { header, children, footer }: Props = $props();
</script>

<main class="main">
	<div class="main__container main__container--header">
		{@render header?.()}
	</div>

	{@render children?.()}

	<div class="main__container main__container--footer">
		{@render footer?.()}
	</div>
</main>

<style lang="scss">
	main.main {
		display: grid;
		grid-template-areas:
			'header'
			'footer';
		grid-template-rows: max-content auto;
		position: relative;
		width: 100%;
		height: 100%;
	}

	div.main__container {
		position: relative;
		z-index: 10;
		width: 100%;

		&--header {
			grid-area: header;
			height: max-content;
		}

		&--footer {
			display: grid;
			width: 100%;
			grid-area: footer;
		}
	}
</style>
