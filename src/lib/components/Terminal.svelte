<script lang="ts">
	import type { TerminalLine } from './Terminal';
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';

	export let lines: TerminalLine[] = [];
	export let autoScroll = false;
	export let isLastTerminal: boolean = false;
	let scrollToRef: HTMLDivElement;

	onMount(() => {
		if (autoScroll) {
			setTimeout(() => {
				scrollToRef.scrollIntoView({ behavior: 'smooth' });
			}, 251);
		}
	});
</script>

<ul class="terminal" in:slide={{ duration: 250 }}>
	{#each lines as line, i}
		<li
			class="
        terminal__line
        {isLastTerminal ? `terminal__line--last-terminal` : ''}
        {line.type ? `terminal__line--${line.type}` : ''}
			"
		>
			{line.text ?? ''}
		</li>
	{/each}

	<!-- We use this to include an <input> in the "Headquarters" screen -->
	<slot />
</ul>

<div bind:this={scrollToRef} />

<style lang="scss">
	ul.terminal {
		font-size: 16px;
		list-style: none;
		padding: unset;
		margin-block: unset;
		min-width: 100%;

		@media (max-width: 512px) {
			font-size: 14px;
		}

		&:not(ul.terminal:last-of-type) {
			border-bottom: 1px dashed var(--color-neutral-500);
			padding-bottom: var(--terminal-block);
			margin-bottom: var(--terminal-block);
		}
	}

	:global(li.terminal__line) {
		font-family: var(--font-family-mono);
		color: var(--color-neutral-200);
		padding-inline: var(--spacing-l);
		margin-block: calc(var(--terminal-block) / 2);
		box-sizing: border-box;
	}

	:global(li.terminal__line:first-child) {
		margin-top: 0;
	}

	:global(li.terminal__line:last-child) {
		margin-bottom: 0;
	}

	li.terminal__line--title {
		font-size: 0.8em;
		letter-spacing: 0.05em;
		color: var(--color-neutral-50);
		font-weight: 700;
		text-transform: uppercase;

		&::before {
			content: '> ';
		}
	}
</style>
