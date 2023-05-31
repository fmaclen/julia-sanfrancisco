<script lang="ts">
	import LL from '$i18n/i18n-svelte';

	export let value: string | undefined = undefined;

	let unknown: string = $LL.warrants.labels.unknown();
	let selectedOption: string = unknown;

	function handleOptionChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		selectedOption = target.value;
	}
</script>

<select
	name="sex"
	on:change={handleOptionChange}
	bind:value
	class="
		terminal-form__select
		{value === undefined ? 'terminal-form__select--unknown' : ''}
	"
>
	<option selected value={undefined}>{unknown}</option>
	<slot />
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
