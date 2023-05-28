<script lang="ts">
	export let title: string | undefined = undefined;
	export let disabled: boolean = false;
	export let active: boolean = false;
	export let compact: boolean = false;
</script>

<button
	class="button {active ? 'button--active' : ''} {compact ? 'button--compact' : ''}"
	{disabled}
	{title}
	on:click
>
	<slot />
</button>

<style lang="scss">
	@import '$lib/components/mixins.scss';

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
	}
</style>
