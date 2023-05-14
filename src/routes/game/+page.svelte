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
		stolenTreasure: getRandomValue(startingDestination.stolen),
		suspect,
		rounds: getRounds(startingDestination, atlasesInRound, suspect)
	};
	const { rounds } = game;

	function resetScene(): void {
		isDepartingTo = false;
		isWalking = false;
		currentClueIndex = null;
		isDescriptionVisible = true;
	}

	function flyTo(): void {
		resetScene();
		isDescriptionVisible = false;
		isDepartingTo = true;
	}

	function walkTo(): void {
		resetScene();
		isWalking = true;
	}

	async function getClue(index: number): Promise<void> {
		resetScene();
		isDescriptionVisible = false;
		isTimeAdvancing = true;
		isTimeAdvancing = await clock.fastForward(2);
		currentClueIndex = index;
		artworkPath = getArtworkPath(currentRound.scenes[index].place, 'places');
	}

	function dismissClue(): void {
		currentClueIndex = null;
		isTimeAdvancing = true;

		setTimeout(() => {
			artworkPath = getArtworkPath(currentRound.atlas.city, 'atlas');
			isTimeAdvancing = false;
			resetScene();
		}, DELAY_IN_MS);
	}

	async function setScene(destination: Atlas): Promise<void> {
		resetScene();
		isDescriptionVisible = false;
		isTraveling = true;
		isTimeAdvancing = true;
		isTimeAdvancing = await clock.fastForward(4);
		isTraveling = isTimeAdvancing;

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

	onMount(() => {
		clock.start();

		setInterval(() => {
			currentTime = clock.getCurrentTime();
			isSleeping = clock.isSleeping;
			isTimeUp = clock.isTimeUp;
		}, clock.tickRate);
	});

	let currentClueIndex: number | null = null;

	let clock = new Clock();
	let currentTime: string;
	let isTraveling: boolean;
	let isSleeping: boolean;
	let isTimeUp: boolean;

	let isDescriptionVisible = true;
	let isDepartingTo = false;
	let isWalking = false;

	let currentRoundIndex = 0;
	$: currentRound = rounds[currentRoundIndex];
	$: artworkPath = getArtworkPath(currentRound.atlas.city, 'atlas');

	$: isTimeAdvancing = isTraveling || isSleeping;
	$: isGameWon = !isTimeUp && currentRoundIndex === rounds.length - 1;
</script>

<Main>
	<div class="artwork {isTimeAdvancing ? 'artwork--disabled' : ''}">
		<img class="artwork__img" src={artworkPath} alt="Illustration of scene" />
	</div>

	<Header>
		<H1>{isTraveling ? 'Traveling...' : isSleeping ? 'Sleeping...' : currentRound.atlas.city}</H1>
		<time class="time {isTimeAdvancing ? 'time--active' : ''}">{currentTime}</time>
	</Header>

	<Section>
		{#if isDescriptionVisible}
			<P>
				{getRandomValue(currentRound.atlas.descriptions)}
			</P>
		{/if}
	</Section>

	<Section align="bottom">
		{#if isWalking}
			{#each currentRound.scenes as scene, index}
				<Button active={currentClueIndex === index} on:click={() => getClue(index)}>
					{scene.place}
				</Button>
			{/each}
		{/if}

		{#if currentClueIndex !== null}
			<P>
				<strong>{currentRound.scenes[currentClueIndex].witness}</strong>
				<br />
				{currentRound.scenes[currentClueIndex].clue}
			</P>
		{/if}

		{#if isDepartingTo}
			{#each Array.from(currentRound.destinations) as destination}
				<Button on:click={() => setScene(destination)}>
					{destination.city}
				</Button>
			{/each}
		{/if}
	</Section>

	<Nav>
		{#if isGameWon}
			<Button on:click={updateScore}>Continue</Button>
		{:else if currentClueIndex !== null}
			<Button on:click={dismissClue}>Dismiss</Button>
		{:else if !isTimeAdvancing}
			<Button active={isWalking} disabled={isTimeAdvancing} on:click={walkTo}>Walk to</Button>
			<Button active={isDepartingTo} disabled={isTimeAdvancing} on:click={flyTo}>Fly to</Button>
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
		transition: filter 100ms, opacity 500ms;

		&--disabled {
			filter: grayscale(100%) blur(2px);
			opacity: 0;
		}
	}

	img.artwork__img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
</style>
