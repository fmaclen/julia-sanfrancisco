<script lang="ts">
	interface Props {
		class?: string;
		children?: import('svelte').Snippet;
	}

	let { class: className = '', children }: Props = $props();
</script>

<p class="terminal-rows__p {className}">
	{@render children?.()}
</p>

<style lang="scss">
	p.terminal-rows__p {
		box-sizing: border-box;
		font-family: var(--font-family-mono);
		color: var(--color-neutral-150);
		margin: unset;

		@media (max-width: 512px) {
			font-size: 14px;
		}
	}
</style>
