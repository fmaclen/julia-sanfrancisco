<script lang="ts">
	import type { TerminalRow } from './Terminal';
	import TerminalParagraph from './TerminalParagraph.svelte';
	import TerminalTitle from './TerminalTitle.svelte';
	import { slide } from 'svelte/transition';

	export let lines: TerminalRow[] = [];
	export let isAnimating: boolean = false;
	export let delay: number | undefined = 0;
</script>

<section
	class="terminal-rows"
	in:slide={{ duration: 500, delay }}
	on:introstart={() => (isAnimating = true)}
	on:introend={() => (isAnimating = false)}
>
	{#each lines as line}
		{#if line.isTitle}
			<TerminalTitle>{line.text}</TerminalTitle>
		{:else}
			<TerminalParagraph>{line.text}</TerminalParagraph>
		{/if}
	{/each}
</section>

<style lang="scss">
	section.terminal-rows {
		display: flex;
		flex-direction: column;
		gap: calc(var(--terminal-block) / 2);
		font-size: 16px;
		list-style: none;
		margin-block: unset;
		box-sizing: border-box;
		padding-block: unset;
		padding-block: var(--terminal-block);
		padding-inline: var(--terminal-inline);

		@media (max-width: 512px) {
			font-size: 14px;
		}
	}
</style>
