<script lang="ts">
	export let disabled: boolean = false;
	export let active: boolean = false;
</script>

<button class="button {active ? 'button--active' : ''}" {disabled} on:click>
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
			color: var(--color-neutral-300);
			opacity: 0.66;
		}

		&:hover:not(:disabled),
		&--active {
			filter: invert(1);
		}
	}
</style>
