<script lang="ts">
	export let title: string | undefined = undefined;
	export let disabled: boolean = false;
	export let active: boolean = false;
</script>

<button class="button {active ? 'button--active' : ''}" {disabled} {title} on:click>
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
			background-color: rgba(50, 50, 50, 0.66);
			cursor: not-allowed;
		}

		&:hover:not(:disabled),
		&--active {
			filter: invert(1);
		}
	}
</style>
