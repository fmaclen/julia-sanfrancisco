<script lang="ts">
	import P from '$lib/components/P.svelte';
	import Section from '$lib/components/Section.svelte';
	import type { Scene } from '$lib/game';

	interface Props {
		scene: Scene;
	}

	let { scene }: Props = $props();
</script>

<Section>
	<section class="paragraph-group">
		<P><strong>{scene.witness.name}</strong></P>
		<P>{scene.clue}</P>

		{#if scene.suspectClue}
			<P>{scene.suspectClue}</P>
		{/if}
	</section>
</Section>
