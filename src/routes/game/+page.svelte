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
	import { playerStore, type Player, getCasesUntilPromotion } from '$lib/player';
	import { getDecoyRound, type Round } from '$lib/rounds';
	import { onMount } from 'svelte';

	function resetRound(): void {
		showDescription = true;
		showPlaces = false;
		showDestinations = false;
		currentClueIndex = null;
		artworkPath = getArtworkPath(currentRound.atlas.city, 'atlas');
		game.currentTime = clock.currentTime;

		// Save the game state to localStorage
		gameStore.set(game);
	}

	function flyTo(): void {
		if (!showDestinations) resetRound();
		showDestinations = !showDestinations;
	}

	function walkTo(): void {
		if (!showPlaces) resetRound();
		showPlaces = !showPlaces;
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
			isArtworkHidden = false; // Since clock is not ticking we need to manually show the artwork
		});
	}

	async function setRound(destination: Atlas): Promise<void> {
		showDestinations = false;
		showDescription = false;
		clock.isFlying = true;

		transitionTo(() => {
			const { rounds, currentRoundIndex } = game;

			const isCurrentRound = rounds[currentRoundIndex].atlas === destination;
			const isNextRound = rounds[currentRoundIndex + 1].atlas === destination;
			const isPreviousRound =
				currentRoundIndex > 0 && rounds[currentRoundIndex - 1].atlas === destination;

			if (isCurrentRound) currentRound = rounds[currentRoundIndex];
			if (isNextRound) game.currentRoundIndex += 1;
			if (isPreviousRound) game.currentRoundIndex -= 1;

			// Decoy rounds are used to throw the player off the trail
			const isDecoyRound = !isCurrentRound && !isPreviousRound && !isNextRound;

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

		gameStore.set(null);
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
		if (game.currentTime) clock.currentTime = new Date(game.currentTime);

		// Start game loop
		clock.start();

		// Game loop
		setInterval(() => {
			currentTimeFormatted = clock.getFormattedTime();
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
	let currentTimeFormatted: string;

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
		isGameWon = !isTimeUp && game.currentRoundIndex === game.rounds.length - 1;
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
			<Time {isClockTicking} currentTime={currentTimeFormatted} />
		</Header>

		<Section>
			{#if isGameWon}
				<P><strong>Congratulations!</strong> You caught up with the suspect</P>
				<P>
					Thanks to your help, the <strong>{game.rounds[0].atlas.city}</strong> police have
					apprehended <strong>{game.suspect.name}</strong>.
					<br />
					<br />
					<strong>{game.suspect.name}</strong> had the loot, <strong>{game.stolenTreasure}</strong>,
					which will be returned to the grateful residents of
					<strong>{game.rounds[0].atlas.city}</strong>.
					<br />
					<br />
					We here at Interpol thank you for your good work on this case. Your success will be noted on
					your record.
					<br />
					<br />
					{$playerStore ? getCasesUntilPromotion($playerStore.score + 1) : ''}
					<br />
					<br />
					Ready for the next case, {$playerStore?.name}?
				</P>
			{:else if showDescription && !isClockTicking}
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
