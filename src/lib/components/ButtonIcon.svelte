<script lang="ts">
	import { fade } from 'svelte/transition';

	export let title: string;
	export let disabled: boolean = false;
	export let active: boolean = false;
</script>

<button class="button {active ? 'button--active' : ''}" {disabled} {title} on:click in:fade>
	<slot />
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
