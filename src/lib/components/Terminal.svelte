<script lang="ts">
	import type { TerminalLine } from './Terminal';
	import { slide } from 'svelte/transition';

	export let lines: TerminalLine[] = [];
</script>

<ul class="terminal" transition:slide>
	{#each lines as line, i}
		<li
			class="
        terminal__line
        {line.type ? `terminal__line--${line.type}` : ''}"
		>
			{line.text ?? ''}
		</li>
	{/each}
	<li class="terminal__line">
		<slot />
	</li>
</ul>

<style lang="scss">
	/* @import '$lib/components/mixins.scss'; */

	ul.terminal {
		/* @include plate; */
		list-style: none;
		padding: unset;
		margin-block: unset;
		/* margin-inline: var(--layout-inline); */

		&:not(ul.terminal:last-child) {
			border-bottom: 1px dashed var(--color-neutral-500);
			padding-bottom: 24px;
			margin-bottom: 24px;
		}
	}

	li.terminal__line {
		font-family: var(--font-family-mono);
		color: var(--color-neutral-200);
		padding-inline: var(--spacing-l);
		margin-block: 16px;
		box-sizing: border-box;

		/* &:first-child {
			margin-top: 24px;
		}

		&:last-child {
			margin-bottom: 24px;
		} */

		&--title {
			font-size: 0.8em;
			letter-spacing: 0.05em;
			color: var(--color-neutral-50);
			font-weight: 700;
			text-transform: uppercase;

			&::before {
				content: '> ';
			}
		}

		/* &--line-break {
			height: 1px;
			border-top: 1px dashed var(--color-neutral-500);
			margin-block: 24px;
		} */
	}
</style>
