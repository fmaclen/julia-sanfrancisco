<script lang="ts">
	export let title: string;
	export let disabled: boolean = false;
</script>

<button class="button" {disabled} {title} on:click>
	<slot />
</button>

<style lang="scss">
	button.button {
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
	}
</style>
