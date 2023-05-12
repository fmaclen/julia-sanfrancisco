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

	function getStartTime(): Date {
		const monday = new Date();
		monday.setHours(9, 0, 0, 0); // Set time to 9:00 am
		monday.setDate(monday.getDate() - ((monday.getDate() + 6) % 7)); // Set to the previous Monday
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

	function resetScene(): void {
		isDepartingTo = false;
		isLookingForClues = false;
		currentClueIndex = null;
	}

	function departTo(): void {
		resetScene();
		isDepartingTo = !isDepartingTo;
	}

	function findClues(): void {
		resetScene();
		isLookingForClues = !isLookingForClues;
	}

	function findClue(index: number): void {
		currentClueIndex = index;
	}

	function travelTo(destination: Atlas): void {
		resetScene();
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

	function updateScore(): void {
		redirectTo('/player/');

		playerStore.update((player: Player | null) => {
			player ? (player.score += 1) : null;
			return player;
		});
	}

	$: currentRoundIndex = 0;
	$: currentRound = game.rounds[currentRoundIndex];

	let currentClueIndex: number | null = null;

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

	{#if !isSceneVisible}
		<section class="round__content">
			<p class="round__p">{getRandomValue(currentRound.atlas.descriptions)}</p>
		</section>
	{/if}

	{#if isLookingForClues}
		<section class="round__content round__content--places">
			{#if typeof currentClueIndex === 'number'}
				<p class="round__p">
					<strong>{currentRound.scenes[currentClueIndex].witness}</strong><br />
					{currentRound.scenes[currentClueIndex].clue}
				</p>
			{/if}

			{#each currentRound.scenes as scene, index}
				<button
					class="round__action {currentClueIndex === index ? 'round__action--active' : ''}"
					on:click={() => findClue(index)}>{scene.place}</button
				>
			{/each}
		</section>
	{/if}

	{#if isDepartingTo}
		<section class="round__content round__content--places">
			{#each Array.from(currentRound.destinations) as destination}
				<button class="round__action" on:click={() => travelTo(destination)}>
					{destination.city}
				</button>
			{/each}
		</section>
	{/if}

	<nav class="round__nav">
		{#if isGameWon}
			<button class="round__action" on:click={updateScore}>You won!</button>
		{:else}
			<button
				class="round__action {isLookingForClues ? 'round__action--active' : ''}"
				on:click={findClues}>Find clues</button
			>
			<button
				class="round__action {isDepartingTo ? 'round__action--active' : ''}"
				on:click={departTo}>Depart to</button
			>
			<button class="round__action" disabled={true} title="Under construction">Get warrant</button>
			<a class="round__action round__action--quit" href="/">Quit</a>
		{/if}
	</nav>
</main>

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
		gap: 24px;
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
	section.round__content {
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

	/* time.round__time {
	} */

	section.round__content {
		display: flex;
		align-items: flex-start;

		&--places {
			justify-content: flex-end;
			flex-direction: column;
			gap: 8px;
		}
	}

	p.round__p {
		@include card;
		font-size: 16px;
		line-height: 130%;
		margin-block: 0;
		width: 100%;
		box-sizing: border-box;
	}

	nav.round__nav {
		display: flex;
		width: 100%;
		box-sizing: border-box;
		gap: 8px;
	}

	a.round__action,
	button.round__action {
		@include card;
		display: block;
		border: none;
		text-align: center;
		text-decoration: none;
		width: 100%;
		font-size: 14px;

		&:not(:disabled) {
			cursor: pointer;
		}

		&:disabled {
			color: var(--color-neutral-300);
			opacity: 0.66;
		}
	}

	button.round__action--active {
		filter: invert(1);
	}

	a.round__action--quit {
		background-color: #421108;
	}
</style>
