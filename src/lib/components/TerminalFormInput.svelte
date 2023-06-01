<script lang="ts">
	export let value: string = '';
	export let disabled: boolean = false;
	export let placeholder: string | undefined = undefined;
</script>

<input class="terminal-form__input" type="text" name="name" {placeholder} {disabled} bind:value />

<style lang="scss">
	input.terminal-form__input {
		display: block;
		box-sizing: border-box;
		background: transparent;
		border: unset;
		outline: none;
		padding: unset;
		width: 100%;
		font-size: 16px;
		font-family: var(--font-family-mono);
		color: var(--color-accent);

		@media (max-width: 512px) {
			font-size: 14px;
		}

		&::placeholder {
			color: var(--color-neutral-500);
		}

		&:disabled {
			color: var(--color-neutral-200);
		}
	}
</style>
