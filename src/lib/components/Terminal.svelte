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
			in:slide={{ delay: i * 2000 }}
			class="
        terminal__line
        {line.type ? `terminal__line--${line.type}` : ''}"
		>
			<!-- <span transition:typewriter>{line.text}</span> -->
			{line.text}
		</li>
	{/each}
</ul>

<style lang="scss">
	ul.terminal {
		list-style: none;
		width: 100%;
		padding-left: 0;
		padding-block: 8px;
		background-color: var(--color-neutral-900);
		border-radius: var(--border-radius-m);
	}

	li.terminal__line {
		font-family: 'Courier New', Courier, monospace;
		color: var(--color-neutral-100);
		padding-inline: 24px;
		margin-block: 16px;
		box-sizing: border-box;

		&--title {
			font-weight: bold;
			text-transform: uppercase;
		}

		&--line-break {
			height: 1px;
			border-top: 1px dashed var(--color-neutral-500);
			margin-top: 8px;
			padding-bottom: 8px;
		}
	}
</style>
