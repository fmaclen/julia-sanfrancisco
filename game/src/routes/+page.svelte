<script lang="ts">
	import { BRIEFING, LOCATION_CLUES } from "../lib/dialog";
</script>

<div class="wrapper">
	<h1>Julia Sanfrancisco</h1>
	
	<h2>Briefing</h2>
	{#each BRIEFING as briefing}
		<p>{briefing}</p>
	{/each}
	
	<h2>Location clue</h2>
	{#each LOCATION_CLUES as locationClue}
		<p>{locationClue}</p>
	{/each}
</div>

<style lang="scss">
	.wrapper {
		max-width: 640px;
		margin-inline: auto;
	}
</style>