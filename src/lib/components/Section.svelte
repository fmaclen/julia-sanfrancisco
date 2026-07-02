<script lang="ts">
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<section class="section">
	{@render children?.()}
</section>

<style lang="scss">
	section.section {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		margin-inline: var(--layout-inline);
	}
</style>
