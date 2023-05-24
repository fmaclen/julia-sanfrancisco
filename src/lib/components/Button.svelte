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
			color: var(--color-neutral-600);
			background-color: rgba(75, 75, 75, 0.5);
		}

		&:hover:not(:disabled),
		&--active {
			filter: invert(1);
		}
	}
</style>
