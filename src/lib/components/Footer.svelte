<script lang="ts">
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<footer class="footer">
	{@render children?.()}
</footer>

<style lang="scss">
	footer.footer {
		display: flex;
		flex-direction: column;
		gap: var(--layout-block);
		margin-top: auto;
		margin-bottom: var(--layout-block);
	}
</style>
