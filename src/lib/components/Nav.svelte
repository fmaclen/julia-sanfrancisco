<script lang="ts">
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<nav class="nav">
	{@render children?.()}
</nav>

<style lang="scss">
	nav.nav {
		display: flex;
		height: max-content;
		justify-content: center;
		column-gap: 8px;
		margin-inline: var(--layout-inline);
	}
</style>
