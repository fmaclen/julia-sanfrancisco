<script lang="ts">
	import { playSfx } from '$lib/sfx';
	import TerminalParagraph from './TerminalParagraph.svelte';
	import TerminalTitle from './TerminalTitle.svelte';
	import type { TerminalRow } from './Terminal';
	import './typewriter-container.scss';
	import { untrack } from 'svelte';

	const TYPEWRITER_INTERVAL_IN_MS = 30;

	interface Props {
		lines?: TerminalRow[];
		isAnimating?: boolean;
		shouldAutoScroll?: boolean;
	}

	let { lines = [], isAnimating = $bindable(true), shouldAutoScroll = false }: Props = $props();

	let scrollToRef: HTMLDivElement | undefined = $state();
	let visibleCharacters = $state(0);
	let animationIntervalId: ReturnType<typeof setInterval> | undefined;
	let scrollIntervalId: ReturnType<typeof setInterval> | undefined;
	let totalCharacters = $derived(lines.reduce((total, line) => total + line.text.length, 0));

	function clearAnimationInterval(): void {
		if (animationIntervalId) clearInterval(animationIntervalId);
		animationIntervalId = undefined;
	}

	function clearScrollInterval(): void {
		if (scrollIntervalId) clearInterval(scrollIntervalId);
		scrollIntervalId = undefined;
	}

	function getLineStart(index: number): number {
		return lines.slice(0, index).reduce((total, line) => total + line.text.length, 0);
	}

	function getVisibleText(line: TerminalRow, index: number): string {
		const lineStart = getLineStart(index);
		const lineCharacters = Math.max(0, Math.min(line.text.length, visibleCharacters - lineStart));

		return line.text.slice(0, lineCharacters);
	}

	function getLineClass(line: TerminalRow, index: number): string {
		const lineStart = getLineStart(index);
		const lineEnd = lineStart + line.text.length;

		if (isAnimating && visibleCharacters >= lineStart && visibleCharacters < lineEnd)
			return 'typing';
		if (visibleCharacters >= lineEnd) return 'finished-typing';

		return '';
	}

	function shouldRenderLine(index: number): boolean {
		return visibleCharacters >= getLineStart(index);
	}

	function startAnimation(): void {
		clearAnimationInterval();
		visibleCharacters = 0;
		isAnimating = true;

		if (totalCharacters === 0) {
			isAnimating = false;
			return;
		}

		animationIntervalId = setInterval(() => {
			visibleCharacters += 1;
			if (visibleCharacters % 3 === 0) playSfx('type');

			if (visibleCharacters >= totalCharacters) {
				visibleCharacters = totalCharacters;
				isAnimating = false;
				clearAnimationInterval();
			}
		}, TYPEWRITER_INTERVAL_IN_MS);
	}

	$effect(() => {
		return untrack(() => {
			if (shouldAutoScroll) {
				scrollIntervalId = setInterval(() => {
					if (isAnimating && scrollToRef) scrollToRef.scrollIntoView();
				}, 100);
			}

			return () => {
				clearAnimationInterval();
				clearScrollInterval();
			};
		});
	});

	$effect(() => {
		lines;
		startAnimation();

		return clearAnimationInterval;
	});

	$effect(() => {
		if (shouldAutoScroll && !isAnimating) clearScrollInterval();
	});
</script>

<section class="typewriter-container cursor">
	{#each lines as line, index}
		{#if shouldRenderLine(index)}
			{#if line.isTitle}
				<TerminalTitle class={getLineClass(line, index)}
					>{getVisibleText(line, index)}</TerminalTitle
				>
			{:else}
				<TerminalParagraph class={getLineClass(line, index)}
					>{getVisibleText(line, index)}</TerminalParagraph
				>
			{/if}
		{/if}
	{/each}
</section>

{#if shouldAutoScroll}
	<div class="typewriter-scroll-anchor" bind:this={scrollToRef}></div>
{/if}

<style>
	@keyframes cursorFade {
		0%,
		100% {
			opacity: 1;
		}

		50% {
			opacity: 0;
		}
	}

	section.typewriter-container.cursor :global(.typing::after) {
		content: '';
		width: var(--cursor-width, 1ch);
		height: 2ch;
		display: inline-block;
		vertical-align: text-top;
		background-color: var(--cursor-color, #000000);
		animation: cursorFade 1.25s infinite;
	}

	section.typewriter-container :global(.finished-typing::after) {
		content: none;
	}
</style>
