<script lang="ts">
	import { ATLASES, getRandomAtlas, type Atlas } from '$lib/atlases';
	import { getRandomValue, redirectTo } from '$lib/helpers';
	import { getRank, playerStore, type Player } from '$lib/player';
	import { getRounds, getDecoyRound, type Round } from '$lib/rounds';
	import { SUSPECTS, type Suspect } from '$lib/suspects';
	import { format } from 'date-fns';

	interface Game {
		currentTime: Date;
		stolenTreasure: string;
		suspect: Suspect;
		rounds: Round[];
	}

	// If there is no user profile, redirect to the player page
	if ($playerStore === null) redirectTo('player/');

	const atlasesInRound = [...ATLASES];
	const startingDestination: Atlas = getRandomAtlas();

	function getStartTime() {
		const monday = new Date();
		monday.setUTCHours(9, 0, 0, 0); // Set time to 9:00 am
		monday.setUTCDate(monday.getUTCDate() - ((monday.getUTCDay() + 6) % 7)); // Set to the previous Monday
		return monday;
	}

	function getRandomStolenItem(): string {
		return getRandomValue(startingDestination.stolen);
	}

	function getRandomSuspect(): Suspect {
		return getRandomValue(SUSPECTS);
	}

	const game: Game = {
		currentTime: getStartTime(),
		stolenTreasure: getRandomStolenItem(),
		suspect: getRandomSuspect(),
		rounds: getRounds(startingDestination, atlasesInRound)
	};

	function travelTo(destination: Atlas) {
		const { rounds } = game;

		const isPreviousRoundAtlas =
			currentRoundIndex !== 0 && rounds[currentRoundIndex - 1].atlas === destination;
		const isCurrentRound = rounds[currentRoundIndex].atlas === destination;
		const isNextRoundAtlas = rounds[currentRoundIndex + 1].atlas === destination;
		const isDecoyRound = !isCurrentRound && !isPreviousRoundAtlas && !isNextRoundAtlas;

		if (isCurrentRound) currentRound = rounds[currentRoundIndex];
		if (isPreviousRoundAtlas) currentRoundIndex -= 1;
		if (isNextRoundAtlas) currentRoundIndex += 1;

		// There should always be a way to return to the
		const anchorDestination = rounds[currentRoundIndex].atlas;
		if (isDecoyRound) {
			currentRound = getDecoyRound(destination, anchorDestination);
		}
	}

	function updateScore() {
		playerStore.update((player: Player | null) => {
			player ? (player.score += 1) : null;
			return player;
		});

		redirectTo('player/');
	}

	$: currentRoundIndex = 0;
	$: currentRound = game.rounds[currentRoundIndex];
	$: isGameWon = currentRoundIndex === game.rounds.length - 1;
</script>

<form>
	<fieldset>
		<legend>Debug controls</legend>
		<p>
			<strong> rounds: </strong>
			{#each game.rounds as round, i}
				<u style={currentRoundIndex === i ? `color: tomato;` : ''}>
					{round.atlas.city} ({i})
				</u>
				&nbsp;
			{/each}
		</p>
		<button on:click={() => (currentRoundIndex -= 1)} disabled={currentRoundIndex === 0}>
			Prev round
		</button>
		<button
			on:click={() => (currentRoundIndex += 1)}
			disabled={currentRoundIndex === game.rounds.length - 1}>Next round</button
		>
	</fieldset>
</form>

{#if $playerStore}
	<p>Name: <u>{$playerStore.name}</u> - Rank: <u>{getRank($playerStore.score)}</u></p>
{/if}

<p>The stolen item is <u>{game.stolenTreasure}</u></p>
<p>The suspect sex is <u>{game.suspect.sex}</u></p>

<hr />

<h1>{currentRound.atlas.city}</h1>
<h2>{format(game.currentTime, 'EEEE hh:mm aaa')}</h2>

<hr />

<h3>Walk to</h3>

<ul>
	{#each currentRound.scenes as scene}
		<li>
			<p>
				<strong>{scene.place}</strong><br />
				<strong>{scene.witness}</strong> — {scene.clue}
			</p>
		</li>
	{/each}
</ul>

<hr />
{#if isGameWon}
	<h3>You win!</h3>
	<button on:click={updateScore}>Continue</button>
{:else}
	<h3>Depart to</h3>
	<ul>
		{#each Array.from(currentRound.destinations) as destination}
			<li>
				<button on:click={() => travelTo(destination)}>{destination.city}</button>
			</li>
		{/each}
	</ul>
{/if}

<hr />

<a href="/">Abandon game</a>
