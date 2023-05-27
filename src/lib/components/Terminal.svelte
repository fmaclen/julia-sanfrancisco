<script lang="ts">
	import type { TerminalLine } from './Terminal';
	import { slide } from 'svelte/transition';

	export let lines: TerminalLine[] = [];

	// type TypewriterTransition = {
	// 	duration: number;
	// 	tick: (t: number) => void;
	// };

	// function typewriter(node: HTMLElement): TypewriterTransition {
	// 	const SPEED = 2;
	// 	const valid = node.childNodes.length === 1 && node.childNodes[0].nodeType === Node.TEXT_NODE;

	// 	if (!valid) {
	// 		throw new Error(`This transition only works on elements with a single text node child`);
	// 	}

	// 	const text = node.textContent!;
	// 	const duration = text.length / (SPEED * 0.01);

	// 	return {
	// 		duration,
	// 		tick: (t: number) => {
	// 			const i = Math.trunc(text.length * t);
	// 			node.textContent = text.slice(0, i);
	// 		}
	// 	};
	// }
</script>

<ul class="terminal">
	{#each lines as line, i}
		<li
			in:slide={{ delay: i * 10 }}
			class="
        terminal__line
        {line.type ? `terminal__line--${line.type}` : ''}"
		>
			<!-- <span transition:typewriter>{line.text}</span> -->
			{line.text ?? ''}
		</li>
	{/each}
</ul>

<style lang="scss">
	@import '$lib/components/mixins.scss';

	ul.terminal {
		@include plate;
		list-style: none;
		width: 100%;
		padding: unset;
		margin: unset;
	}

	li.terminal__line {
		font-family: var(--font-family-mono);
		color: var(--color-neutral-100);
		padding-inline: var(--spacing-l);
		margin-block: 16px;
		box-sizing: border-box;

		&:first-child {
			margin-top: 24px;
		}

		&:last-child {
			margin-bottom: 24px;
		}

		&--title {
			font-weight: 700;
			text-transform: uppercase;
		}

		&--line-break {
			height: 1px;
			border-top: 1px dashed var(--color-neutral-500);
			margin-block: 24px;
		}
	}
</style>
