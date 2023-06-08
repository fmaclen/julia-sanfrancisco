<script lang="ts">
	import TerminalParagraph from './TerminalParagraph.svelte';
	import TerminalTitle from './TerminalTitle.svelte';
	import type { TerminalRow } from './terminal';
	import './terminal.scss';
	import { onMount } from 'svelte';
	import Typewriter from 'svelte-typewriter';

	export let lines: TerminalRow[] = [];
	export let isAnimating: boolean = true;

	onMount(() => {
		isAnimating = true;
	});
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
