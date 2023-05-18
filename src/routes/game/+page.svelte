<script lang="ts">
	import type { Atlas } from '$lib/atlases';
	import Clock, { DELAY_IN_MS } from '$lib/clock';
	import Button from '$lib/components/Button.svelte';
	import ButtonLink from '$lib/components/ButtonLink.svelte';
	import H1 from '$lib/components/H1.svelte';
	import Header from '$lib/components/Header.svelte';
	import Main from '$lib/components/Main.svelte';
	import Nav from '$lib/components/Nav.svelte';
	import P from '$lib/components/P.svelte';
	import Section from '$lib/components/Section.svelte';
	import Time from '$lib/components/Time.svelte';
	import { gameStore, type Game } from '$lib/game';
	import { getArtworkPath, getRandomValue, redirectTo } from '$lib/helpers';
	import { playerStore, type Player } from '$lib/player';
	import { getDecoyRound, type Round } from '$lib/rounds';
	import { onMount } from 'svelte';

	function resetRound(): void {
		showDescription = true;
		showPlaces = false;
		showDestinations = false;
		currentClueIndex = null;
		artworkPath = getArtworkPath(currentRound.atlas.city, 'atlas');

		// Save the game state to localStorage
		gameStore.set(game);
	}

	function flyTo(): void {
		resetRound();
		showDestinations = true;
	}

	function walkTo(): void {
		resetRound();
		showPlaces = true;
	}

	async function getClue(index: number): Promise<void> {
		showPlaces = false;
		showDescription = false;
		clock.isWalking = true;

		transitionTo(() => {
			currentClueIndex = index;
			if (currentRound) artworkPath = getArtworkPath(currentRound.scenes[index].place, 'places');
		});

		await clock.fastForward(2);
	}

	function dismissClue(): void {
		transitionTo(() => {
			resetRound();
			isArtworkHidden = false; // NOTE: maybe this should be moved to the setTimeout inisde transitionTo()
		});
	}

	async function setRound(destination: Atlas): Promise<void> {
		showDestinations = false;
		showDescription = false;
		clock.isFlying = true;

		transitionTo(() => {
			const { rounds, currentRoundIndex } = game;

			const isPreviousRoundAtlas =
				currentRoundIndex !== 0 && rounds[currentRoundIndex - 1].atlas === destination;
			const isCurrentRound = rounds[currentRoundIndex].atlas === destination;
			const isNextRoundAtlas = rounds[currentRoundIndex + 1].atlas === destination;
			const isDecoyRound = !isCurrentRound && !isPreviousRoundAtlas && !isNextRoundAtlas;

			if (isCurrentRound) currentRound = rounds[currentRoundIndex];
			if (isPreviousRoundAtlas) game.currentRoundIndex -= 1;
			if (isNextRoundAtlas) game.currentRoundIndex += 1;

			// Decoy rounds are used to throw the player off the trail
			// There should always be a way to return to the round where the suspect trail was lost
			const anchorDestination = rounds[currentRoundIndex].atlas;
			if (isDecoyRound) {
				currentRound = getDecoyRound(destination, anchorDestination);
				game.roundDecoy = currentRound;
			} else {
				game.roundDecoy = null;
			}

			// Must reset round after transition
			resetRound();
		});

		await clock.fastForward(4);
	}

	function transitionTo(callback: Function) {
		isArtworkHidden = true;

		setTimeout(() => {
			callback();
		}, DELAY_IN_MS);
	}

	function updateScore(): void {
		redirectTo('/headquarters/');

		playerStore.update((player: Player | null) => {
			player ? (player.score += 1) : null;
			return player;
		});
	}

	onMount(() => {
		// Load game state from localStorage

		// Can't start the game without $playerStore and $gameStore
		// Redirect back to HQ to generate them
		if ($playerStore === null || $gameStore === null) {
			redirectTo('/headquarters/');
			return new Error('No player or game store');
		}

		// Set game state from localStorage
		game = $gameStore;

		// Set current round
		currentRound = game.roundDecoy ? game.roundDecoy : game.rounds[game.currentRoundIndex];

		// Start game loop
		clock.start();

		// Game loop
		setInterval(() => {
			currentTime = clock.getCurrentTime();
			isWalking = clock.isWalking;
			isFlying = clock.isFlying;
			isSleeping = clock.isSleeping;
			isTimeUp = clock.isTimeUp;
		}, clock.tickRate);

		isLoading = false;
	});

	let game: Game;
	let currentRound: Round;
	let currentClueIndex: number | null = null;

	let clock = new Clock();
	let currentTime: string;

	let isLoading: boolean = true;
	let isWalking: boolean;
	let isFlying: boolean;
	let isSleeping: boolean;
	let isTimeUp: boolean;
	let isGameWon: boolean;
	let artworkPath: string;

	let showPlaces = false;
	let showDestinations = false;
	let showDescription = true;

	$: if (game) {
		currentRound = game.roundDecoy ? game.roundDecoy : game.rounds[game.currentRoundIndex];
		isGameWon = isTimeUp && game.currentRoundIndex === game.rounds.length - 1;
		artworkPath = getArtworkPath(currentRound.atlas.city, 'atlas');
	}

	$: isClockTicking = isSleeping || isWalking || isFlying;
	$: isArtworkHidden = isClockTicking && !isSleeping;
	$: isClueVisible = currentClueIndex !== null && !isWalking && !isSleeping;
</script>

<Main>
	{#if isLoading}
		<Section>
			<P>Loading...</P>
		</Section>
	{:else if currentRound}
		<div
			class="artwork {isArtworkHidden ? 'artwork--hidden' : ''} {isSleeping
				? 'artwork--disabled'
				: ''}"
		>
			<img class="artwork__img" src={artworkPath} alt="Illustration of scene" />
		</div>

		<Header>
			<H1>
				{isSleeping
					? 'Sleeping...'
					: isFlying
					? 'Flying...'
					: isWalking
					? 'Walking...'
					: currentRound.atlas.city}
			</H1>
			<Time {isClockTicking} {currentTime} />
		</Header>

		<Section>
			{#if showDescription}
				<P>
					{getRandomValue(currentRound.atlas.descriptions)}
				</P>
			{/if}
		</Section>

		<Section align="bottom">
			{#if showPlaces}
				{#each currentRound.scenes as scene, index}
					<Button active={currentClueIndex === index} on:click={() => getClue(index)}>
						{scene.place}
					</Button>
				{/each}
			{/if}

			{#if isClueVisible && currentClueIndex !== null}
				<P>
					<strong>{currentRound.scenes[currentClueIndex].witness}</strong>
					<br />
					{currentRound.scenes[currentClueIndex].clue}
				</P>
			{/if}

			{#if showDestinations}
				{#each Array.from(currentRound.destinations) as destination}
					<Button on:click={() => setRound(destination)}>
						{destination.city}
					</Button>
				{/each}
			{/if}
		</Section>

		<Nav>
			{#if isGameWon}
				<Button on:click={updateScore}>Continue</Button>
			{:else if isClueVisible}
				<Button on:click={dismissClue}>Dismiss</Button>
			{:else if !isClockTicking}
				<Button active={isWalking} on:click={walkTo}>Walk to</Button>
				<Button active={isFlying} on:click={flyTo}>Fly to</Button>
				<ButtonLink href="/">Quit</ButtonLink>
			{/if}
		</Nav>
	{/if}
</Main>

<style lang="scss">
	div.artwork {
		position: absolute;
		z-index: -1;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		opacity: 1;
		transition: filter 1500ms, opacity 500ms;

		&--hidden {
			opacity: 0;
		}

		&--disabled {
			filter: grayscale(100%) blur(4px);
		}
	}

	img.artwork__img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
</style>
