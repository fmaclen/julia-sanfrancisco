<script lang="ts">
	import { fade } from 'svelte/transition';

	interface Props {
		title: string;
		disabled?: boolean;
		active?: boolean;
		onclick?: (event: MouseEvent) => void;
		children?: import('svelte').Snippet;
	}

	let { title, disabled = false, active = false, onclick, children }: Props = $props();
</script>

<button class="button {active ? 'button--active' : ''}" {disabled} {title} {onclick} in:fade|global>
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
