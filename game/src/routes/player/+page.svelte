<script lang="ts">
	import { Rank } from '$lib/helpers';
	import { playerStore } from '$lib/stores/player';
	import { redirect } from '@sveltejs/kit';

	let playerName: string;
	let rank = getRank($playerStore?.score);

	function getRank(score: number | undefined) {
		if (score === undefined || score === 0) return Rank.ROOKIE;
		else if (score < 4) return Rank.SLEUTH;
		else if (score < 7) return Rank.PRIVATE_EYE;
		else if (score < 10) return Rank.INVESTIGATOR;
		else if (score < 14) return Rank.ACE_DETECTIVE;
		else return Rank.SUPER_SLEUTH;
	}

	function setPlayer() {
		playerStore.set({ name: playerName, score: 0 });
		redirect(307, '/game');
	}
</script>

<h1>Headquarters</h1>

{#if $playerStore}
	<p>You have been identified as <u>{$playerStore.name}</u></p>
	<p>Your current rank is <u>{rank}</u></p>
	<a href="/game">Continue</a>
{:else}
	<p>Detective at keyboard, please identify yourself</p>
	<input type="text" name="name" placeholder="Your name" bind:value={playerName} />
	<button on:click={setPlayer} disabled={!playerName}> Continue </button>
{/if}
