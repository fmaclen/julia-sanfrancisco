<script lang="ts">
	import { redirectTo } from '$lib/helpers';
	import { getRank } from '$lib/player';
	import { playerStore } from '$lib/player';

	let playerName: string;
	let rank = getRank($playerStore?.score);

	function setPlayer() {
		redirectTo('/game/');
		playerStore.set({ name: playerName, score: 0 });
	}
</script>

<h1>Headquarters</h1>

{#if $playerStore}
	<p>You have been identified as <u>{$playerStore.name}</u></p>
	<p>Your current rank is <u>{rank}</u></p>
	<a href="/game/">Continue</a>
{:else}
	<p>Detective at keyboard, please identify yourself</p>
	<input type="text" name="name" placeholder="Your name" bind:value={playerName} />
	<button on:click={setPlayer} disabled={!playerName}> Continue </button>
{/if}
