<script lang="ts">
	// import type { TerminalLine } from './Terminal';
	import H3 from './H3.svelte';
	import type { TerminalRow } from './Terminal';
	// import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';

	export let lines: TerminalRow[] = [];
	export let isAnimating: boolean = false;
	// export let autoScroll = false;
	// let scrollToRef: HTMLDivElement;

	// onMount(() => {
	// 	if (autoScroll) {
	// 		setTimeout(() => {
	// 			scrollToRef.scrollIntoView({ behavior: 'smooth' });
	// 		}, 251);
	// 	}
	// });
</script>

<section
	class="terminal-rows"
	in:slide={{ duration: 500 }}
	on:introstart={() => (isAnimating = true)}
	on:introend={() => (isAnimating = false)}
>
	{#each lines as line}
		{#if line.isTitle}
			<H3>
				{line.text}
			</H3>
		{:else}
			<p class="terminal-rows__p">
				{line.text}
			</p>
		{/if}
	{/each}
</section>

<!-- <div bind:this={scrollToRef} /> -->

<style lang="scss">
	section.terminal-rows {
		min-width: 100%;
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

		&:not(section.terminal-rows:last-of-type) {
			/* border-bottom: 1px dashed var(--color-neutral-500); */
			/* padding-bottom: var(--terminal-block); */
			/* margin-bottom: var(--terminal-block); */
		}
	}

	p.terminal-rows__p {
		box-sizing: border-box;
		font-family: var(--font-family-mono);
		color: var(--color-neutral-200);
		margin-block: calc(var(--terminal-block) / 2);
	}

	:global(p.terminal-rows__p:first-child) {
		margin-top: 0;
	}

	:global(p.terminal-rows__p:last-child) {
		margin-bottom: 0;
	}
</style>
