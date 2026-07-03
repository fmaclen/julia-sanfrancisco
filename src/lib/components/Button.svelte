<script lang="ts">
	import { playSfx } from '$lib/sfx';

	interface Props {
		title?: string | undefined;
		disabled?: boolean;
		active?: boolean;
		compact?: boolean;
		transparent?: boolean;
		onclick?: (event: MouseEvent) => void;
		children?: import('svelte').Snippet;
	}

	let {
		title = undefined,
		disabled = false,
		active = false,
		compact = false,
		transparent = false,
		onclick,
		children
	}: Props = $props();
</script>

<button
	class="
		button
		{active ? 'button--active' : ''}
		{compact ? 'button--compact' : ''}
		{transparent ? 'button--transparent' : ''}
	"
	{disabled}
	{title}
	onclick={(event) => {
		playSfx('click');
		onclick?.(event);
	}}
>
	{@render children?.()}
</button>

<style lang="scss">
	@use '$lib/components/mixins.scss' as *;

	button.button {
		@include plate;
		@include button;

		&:not(:disabled) {
			cursor: pointer;
		}

		&:disabled {
			color: var(--color-neutral-400);
			background-color: rgba(75, 75, 75, 0.66);
			cursor: not-allowed;
		}

		&:hover:not(:disabled),
		&--active {
			color: var(--color-neutral-900);
			background-color: rgba(255, 255, 255, 0.66);
		}

		&--compact {
			width: max-content;
			font-size: 1.5em;
			padding: 0.5em;
		}

		&--transparent:disabled,
		&--transparent {
			background-color: transparent;
			backdrop-filter: unset;
			-webkit-backdrop-filter: unset;
			border-radius: unset;
		}
	}
</style>
