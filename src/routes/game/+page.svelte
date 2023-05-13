<script lang="ts">
	import { ATLASES, getRandomAtlas, type Atlas } from '$lib/atlases';
	import Clock from '$lib/clock';
	import Button from '$lib/components/Button.svelte';
	import ButtonLink from '$lib/components/ButtonLink.svelte';
	import H1 from '$lib/components/H1.svelte';
	import Header from '$lib/components/Header.svelte';
	import Main from '$lib/components/Main.svelte';
	import Nav from '$lib/components/Nav.svelte';
	import P from '$lib/components/P.svelte';
	import Section from '$lib/components/Section.svelte';
	import { getRandomValue, redirectTo } from '$lib/helpers';
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
		stolenTreasure: getRandomStolenItem(),
		suspect,
		rounds: getRounds(startingDestination, atlasesInRound, suspect)
	};
	const { rounds } = game;

	function resetScene(): void {
		isDepartingTo = false;
		isLookingForClues = false;
		currentClueIndex = null;
	}

	function departTo(): void {
		isDepartingTo = !isDepartingTo;
		isLookingForClues = false;
	}

	function findClues(): void {
		isLookingForClues = !isLookingForClues;
		isDepartingTo = false;
	}

	function findClue(index: number): void {
		clock.fastForward(2);
		currentClueIndex = index;
	}

	function travelTo(destination: Atlas): void {
		resetScene();

		clock.isTraveling = true;
		clock.fastForward(4);

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
		setInterval(() => {
			currentTime = clock.getCurrentTime();
			isTimeAdvancing = clock.isTimeAdvancing;
			isTraveling = clock.isTraveling;
			isSleeping = clock.isSleeping;
			timeIsUp = clock.timeIsUp;
		}, clock.tickRate);
	});

	let currentRoundIndex = 0;
	let currentClueIndex: number | null = null;

	let clock = new Clock();
	let currentTime: string;
	let isTimeAdvancing: boolean;
	let isTraveling: boolean;
	let isSleeping: boolean;
	let timeIsUp: boolean;

	let isDepartingTo = false;
	let isLookingForClues = false;

	$: currentRound = rounds[currentRoundIndex];
	$: isSceneVisible = isDepartingTo || isLookingForClues;
	$: isGameWon = !timeIsUp && currentRoundIndex === rounds.length - 1;
</script>

<Main>
	<div class="round__background {isTimeAdvancing ? 'round__background--disabled' : ''}">
		<img
			src="/locations/{currentRound.atlas.city
				.replace(' ', '-')
				.replace(' ', '-')
				.toLowerCase()}.png"
			alt="Illustration of {currentRound.atlas.city}"
		/>
	</div>

	<Header>
		<H1>{isTraveling ? 'Traveling...' : isSleeping ? 'Sleeping...' : currentRound.atlas.city}</H1>
		<time class="round__time">{currentTime}</time>
	</Header>

	{#if !isSceneVisible}
		<Section>
			<P>{getRandomValue(currentRound.atlas.descriptions)}</P>
		</Section>
	{/if}

	{#if isLookingForClues}
		<Section align="bottom">
			{#if typeof currentClueIndex === 'number'}
				<P>
					<strong>{currentRound.scenes[currentClueIndex].witness}</strong><br />
					{currentRound.scenes[currentClueIndex].clue}
				</P>
			{/if}

			{#each currentRound.scenes as scene, index}
				<Button active={currentClueIndex === index} on:click={() => findClue(index)}>
					{scene.place}
				</Button>
			{/each}
		</Section>
	{/if}

	{#if isDepartingTo}
		<Section align="bottom">
			{#each Array.from(currentRound.destinations) as destination}
				<Button on:click={() => travelTo(destination)}>
					{destination.city}
				</Button>
			{/each}
		</Section>
	{/if}

	<Nav>
		{#if isGameWon}
			<Button on:click={updateScore}>Continue</Button>
		{:else}
			<button on:click={clock.start}>Start Clock</button>

			<Button active={isLookingForClues} on:click={findClues}>Find clues</Button>
			<Button active={isDepartingTo} on:click={departTo}>Depart to</Button>
			<Button disabled={true}>Get warrant</Button>
			<ButtonLink href="/">Quit</ButtonLink>
		{/if}
	</Nav>
</Main>

<style lang="scss">
	div.round__background {
		position: absolute;
		z-index: -1;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		transition: filter 500ms;

		> img {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}

		&--disabled {
			filter: grayscale(100%) blur(1px);
		}
	}
</style>
