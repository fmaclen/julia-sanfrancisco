<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Section from '$lib/components/Section.svelte';
	import type { Round } from '$lib/game';
	import { slide } from 'svelte/transition';

	interface Props {
		scenes: Round['scenes'];
		currentClueIndex: number | null;
		onSelect: (index: number) => void | Promise<void>;
	}

	let { scenes, currentClueIndex, onSelect }: Props = $props();
</script>

<Section>
	<section class="button-group" in:slide|global>
		{#each scenes as scene, index}
			<Button active={currentClueIndex === index} onclick={() => onSelect(index)}>
				{scene.place.name}
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
