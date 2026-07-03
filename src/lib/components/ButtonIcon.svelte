<script lang="ts">
	import { playSfx } from '$lib/sfx';
	import { fade } from 'svelte/transition';

	interface Props {
		title: string;
		disabled?: boolean;
		active?: boolean;
		silent?: boolean;
		onclick?: (event: MouseEvent) => void;
		children?: import('svelte').Snippet;
	}

	let {
		title,
		disabled = false,
		active = false,
		silent = false,
		onclick,
		children
	}: Props = $props();
</script>

<button
	class="button {active ? 'button--active' : ''}"
	{disabled}
	{title}
	onclick={(event) => {
		if (!silent) playSfx('click');
		onclick?.(event);
	}}
	in:fade|global
>
	{@render children?.()}
</button>

<style lang="scss">
	button.button {
		padding: unset;
		border: unset;
		background: transparent;
		transition: opacity 250ms;

		&:not(:disabled) {
			cursor: pointer;
		}

		&:disabled {
			opacity: 0.25;
			cursor: not-allowed;
		}

		&--active {
			opacity: 0.25;
		}
	}
</style>
