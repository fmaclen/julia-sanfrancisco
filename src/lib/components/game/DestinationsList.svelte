<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Section from '$lib/components/Section.svelte';
	import type { Atlas, Round } from '$lib/game';
	import { slide } from 'svelte/transition';

	interface Props {
		destinations: Round['destinations'];
		onSelect: (destination: Atlas) => void | Promise<void>;
	}

	let { destinations, onSelect }: Props = $props();
</script>

<Section>
	<section class="button-group" in:slide|global>
		{#each Array.from(destinations) as destination}
			<Button onclick={() => onSelect(destination)}>
				{destination.city}
			</Button>
		{/each}
	</section>
</Section>

<style lang="scss">
	section.button-group {
		display: flex;
		flex-direction: column;
		width: 100%;
		gap: 4px;
		max-height: 50dvh;
		overflow-y: auto;
	}
</style>
