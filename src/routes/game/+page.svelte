<script lang="ts">
	import { ATLASES, getRandomAtlas, type Atlas } from '$lib/atlases';
	import Clock, { DELAY_IN_MS } from '$lib/clock';
	import Button from '$lib/components/Button.svelte';
	import ButtonLink from '$lib/components/ButtonLink.svelte';
	import H1 from '$lib/components/H1.svelte';
	import Header from '$lib/components/Header.svelte';
	import Main from '$lib/components/Main.svelte';
	import Nav from '$lib/components/Nav.svelte';
	import P from '$lib/components/P.svelte';
	import Section from '$lib/components/Section.svelte';
	import { getArtworkPath, getRandomValue, redirectTo } from '$lib/helpers';
	import { playerStore, type Player } from '$lib/player';
	import { getRounds, getDecoyRound, type Round } from '$lib/rounds';
	import { SUSPECTS, type Suspect } from '$lib/suspects';
	import { onMount } from 'svelte';

	// If there is no user profile, redirect to the player page
	if ($playerStore === null) redirectTo('/player/');

	interface Game {
		stolenTreasure: string;
		suspect: Suspect;
		rounds: Round[];
	}

	const atlasesInRound = [...ATLASES];
	const startingDestination: Atlas = getRandomAtlas();
	const suspect = getRandomValue(SUSPECTS);

	const game: Game = {
		stolenTreasure: getRandomValue(startingDestination.objects),
		suspect,
		rounds: getRounds(startingDestination, atlasesInRound, suspect)
	};
	const { rounds } = game;

	function resetRound(): void {
		showDescription = true;
		showPlaces = false;
		showDestinations = false;
		currentClueIndex = null;
		artworkPath = getArtworkPath(currentRound.atlas.city, 'atlas');
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
			artworkPath = getArtworkPath(currentRound.scenes[index].place, 'places');
		});

		await clock.fastForward(2);
	}

	function dismissClue(): void {
		transitionTo(() => {
			resetRound();
			isArtworkHidden = false;
		});
	}

	async function setRound(destination: Atlas): Promise<void> {
		showDestinations = false;
		showDescription = false;
		clock.isFlying = true;

		transitionTo(() => {
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
		});

		await clock.fastForward(4);
		resetRound();
	}

	function transitionTo(callback: Function) {
		isArtworkHidden = true;

		setTimeout(() => {
			callback();
		}, DELAY_IN_MS);
	}

	function updateScore(): void {
		redirectTo('/player/');

		playerStore.update((player: Player | null) => {
			player ? (player.score += 1) : null;
			return player;
		});
	}

	onMount(() => {
		clock.start();

		setInterval(() => {
			currentTime = clock.getCurrentTime();
			isWalking = clock.isWalking;
			isFlying = clock.isFlying;
			isSleeping = clock.isSleeping;
			isTimeUp = clock.isTimeUp;
		}, clock.tickRate);
	});

	let currentRoundIndex = 0;
	let currentClueIndex: number | null = null;

	let clock = new Clock();
	let currentTime: string;

	let isWalking: boolean;
	let isFlying: boolean;
	let isSleeping: boolean;
	let isTimeUp: boolean;

	let showPlaces = false;
	let showDestinations = false;
	let showDescription = true;

	$: currentRound = rounds[currentRoundIndex];
	$: artworkPath = getArtworkPath(currentRound.atlas.city, 'atlas');

	$: isClockTicking = isSleeping || isWalking || isFlying;
	$: isArtworkHidden = isClockTicking && !isSleeping;
	$: isClueVisible = currentClueIndex !== null && !isWalking && !isSleeping;
	$: isGameWon = !isTimeUp && currentRoundIndex === rounds.length - 1;
</script>

<Main>
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
		<time class="time {isClockTicking ? 'time--active' : ''}">{currentTime}</time>
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
			<Button disabled={true}>Get warrant</Button>
			<ButtonLink href="/">Quit</ButtonLink>
		{/if}
	</Nav>
</Main>

<style lang="scss">
	time.time {
		opacity: 0.33;
		transition: opacity 250ms;

		&--active {
			opacity: 1;
		}
	}

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
