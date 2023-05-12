<script lang="ts">
	import { ATLASES, getRandomAtlas, type Atlas } from '$lib/atlases';
	import { getRandomValue, redirectTo } from '$lib/helpers';
	import { getRank, playerStore, type Player } from '$lib/player';
	import { getRounds, getDecoyRound, type Round } from '$lib/rounds';
	import type { Place } from '$lib/scenes';
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

	const suspect = getRandomSuspect();

	const game: Game = {
		currentTime: getStartTime(),
		stolenTreasure: getRandomStolenItem(),
		suspect,
		rounds: getRounds(startingDestination, atlasesInRound, suspect)
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

	function departTo() {
		isDepartingTo = true;
		isLookingForClues = false;
	}

	function findClues() {
		isLookingForClues = true;
		isDepartingTo = false;
	}

	function findClue(place: Place) {

	}

	function updateScore() {
		redirectTo('/player/');
		playerStore.update((player: Player | null) => {
			player ? (player.score += 1) : null;
			return player;
		});
	}

	$: currentRoundIndex = 0;
	$: currentRound = game.rounds[currentRoundIndex];

	$: isDepartingTo = false;
	$: isLookingForClues = false;
	$: isSceneVisible = isDepartingTo || isLookingForClues;

	$: isGameWon = currentRoundIndex === game.rounds.length - 1;
</script>

<main
	class="round"
	style="background-image: url('/locations/{currentRound.atlas.city
		.replace(' ', '-')
		.replace(' ', '-')
		.toLowerCase()}.png');"
>
	<header class="round__header">
		<h1 class="round__city">{currentRound.atlas.city}</h1>
		<time class="round__time">{format(game.currentTime, 'EEEE hh:mm aaa')}</time>
	</header>

	<section class="round__scene">
		{#if !isSceneVisible}
			<p class="round__description">{getRandomValue(currentRound.atlas.descriptions)}</p>
		{/if}

		{#if isLookingForClues}
			{#each currentRound.scenes as scene}
				<button on:click={() => findClue(scene.place)}>{scene.place}</button>

				{scene.clue}
			{/each}
		{/if}

		{#if isDepartingTo}
			{#each Array.from(currentRound.destinations) as destination}
				<button on:click={() => travelTo(destination)}>{destination.city}</button>
			{/each}
		{/if}

		{#if isGameWon}
			<h3>You win!</h3>
			<button on:click={updateScore}>Continue</button>
		{/if}
	</section>

	<nav class="round__nav">
		<button class="round__action" on:click={findClues}>Find clues</button>
		<button class="round__action" on:click={departTo}>Depart to</button>
		<button class="round__action" disabled={true} title="Under construction">Get warrant</button>
		<a class="round__action round__action--quit" href="/">Quit</a>
	</nav>
</main>

<!-- <form>
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
</form> -->

<!-- {#if $playerStore}
		<p>Name: <u>{$playerStore.name}</u> - Rank: <u>{getRank($playerStore.score)}</u></p>
	{/if} -->

<!-- <p>The stolen item is <u>{game.stolenTreasure}</u></p>
	<p>The suspect sex is <u>{game.suspect.sex}</u></p> -->

<!-- <hr />


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
-->

<style lang="scss">
	@mixin card {
		padding-inline: 16px;
		padding-block: 16px;
		border-radius: 8px;
		color: var(--color-neutral-100);
		background-color: var(--color-neutral-800);
	}

	main.round {
		display: grid;
		grid-template-rows: max-content auto max-content;
		height: 100%;
		width: 100%;
		max-width: 512px;
		gap: 8px;
		padding-block: 24px;
		box-sizing: border-box;
		background-color: var(--color-neutral-1000);
		background-repeat: no-repeat;
		background-size: cover;
		background-position-y: bottom;
		border-radius: 12px;
		margin-inline: auto;
	}

	header.round__header,
	nav.round__nav,
	section.round__scene {
		padding-inline: 20px;
	}

	header.round__header {
		display: flex;
		flex-direction: column;
		gap: 4px;
		@include card;
		margin-inline: 20px;
	}

	h1.round__city {
		font-size: 24px;
		margin-block: 0;
	}

	time.round__time {
	}

	section.round__scene {
		display: flex;
		align-items: flex-start;
	}

	p.round__description {
		@include card;
		font-size: 20px;
		line-height: 130%;
		margin-block: 0;
	}

	nav.round__nav {
		display: flex;
		width: 100%;
		box-sizing: border-box;
		gap: 8px;
	}

	a.round__action,
	button.round__action {
		display: block;
		background: transparent;
		border: none;
		text-align: center;
		text-decoration: none;
		width: 100%;
		font-size: 14px;
		@include card;

		&:not(:disabled) {
			cursor: pointer;
		}

		&:disabled {
			color: var(--color-neutral-300);
			opacity: 0.66;
		}

		&--quit {
			background-color: #421108;
		}
	}
</style>
