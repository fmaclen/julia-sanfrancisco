<script lang="ts">
	import TerminalParagraph from './TerminalParagraph.svelte';
	import TerminalTitle from './TerminalTitle.svelte';
	import type { TerminalRow } from './terminal';
	import './typewriter-container.scss';
	import { onMount, onDestroy } from 'svelte';
	import Typewriter from 'svelte-typewriter';

	export let lines: TerminalRow[] = [];
	export let isAnimating: boolean = true;
	export let shouldAutoScroll: boolean = false;

	let scrollToRef: HTMLDivElement;
	let intervalId: any;

	onMount(() => {
		isAnimating = true;

		if (!shouldAutoScroll) return;

		intervalId = setInterval(() => {
			if (isAnimating && scrollToRef) scrollToRef.scrollIntoView();
		}, 100);
	});

	onDestroy(() => {
		if (shouldAutoScroll) clearInterval(intervalId);
	});

	$: if (shouldAutoScroll && !isAnimating) {
		clearInterval(intervalId);
	}
</script>

<Typewriter element="section" mode="cascade" on:done={() => (isAnimating = false)}>
	{#each lines as line}
		{#if line.isTitle}
			<TerminalTitle>{line.text}</TerminalTitle>
		{:else}
			<TerminalParagraph>{line.text}</TerminalParagraph>
		{/if}
	{/each}
</Typewriter>

{#if shouldAutoScroll}
	<div class="typewriter-scroll-anchor" bind:this={scrollToRef} />
{/if}
