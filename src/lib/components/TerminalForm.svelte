<script lang="ts">
	import { slide } from 'svelte/transition';
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<section class="terminal-form" in:slide|global>
	{@render children?.()}
</section>

<style lang="scss">
	section.terminal-form {
		display: grid;
		align-items: center;
		grid-template-columns: repeat(2, auto);
		gap: var(--terminal-inline);
		padding-block: var(--terminal-block);
		padding-inline: var(--terminal-inline);
		border-top: 1px dashed var(--color-neutral-500);

		&:first-child {
			border-top: unset;
		}
	}
</style>
