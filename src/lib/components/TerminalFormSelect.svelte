<script lang="ts">
	import LL from '$i18n/i18n-svelte';

	interface Props {
		value?: string | undefined;
		children?: import('svelte').Snippet;
	}

	let { value = $bindable(), children }: Props = $props();

	let unknown: string = $LL.warrants.labels.unknown();
</script>

<select
	name="sex"
	bind:value
	class="
		terminal-form__select
		{value === undefined ? 'terminal-form__select--unknown' : ''}
	"
>
	<option selected value={undefined}>{unknown}</option>
	{@render children?.()}
</select>

<style lang="scss">
	select.terminal-form__select {
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
		cursor: pointer;

		@media (max-width: 512px) {
			font-size: 14px;
		}

		&::placeholder {
			color: var(--color-neutral-500);
		}

		&--unknown {
			color: var(--color-neutral-200);
		}
	}
</style>
