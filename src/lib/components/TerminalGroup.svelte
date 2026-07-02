<script lang="ts">
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<section class="terminal-group">
	{@render children?.()}
</section>

<style lang="scss">
	@use '$lib/components/mixins.scss' as *;

	section.terminal-group {
		@include plate;

		max-height: 400px;
		overflow-y: auto;

		--terminal-block: 24px;
		--terminal-inline: 20px;

		border-radius: var(--border-radius-l);
		margin-inline: var(--layout-inline);
	}
</style>
