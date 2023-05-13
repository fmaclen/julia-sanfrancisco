<script lang="ts">
	import { ATLASES, getRandomAtlas, type Atlas } from '$lib/atlases';
	import Clock, { RATE_IN_MS } from '$lib/clock';
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
	import { fade, slide } from 'svelte/transition';

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

	async function findClue(index: number): Promise<void> {
		isTimeAdvancing = true;
		currentClueIndex = null;
		isTimeAdvancing = await clock.fastForward(2);
		currentClueIndex = index;
		backgroundName = `places/${currentRound.scenes[index].place}`;
	}

	function dismissClue(): void {
		currentClueIndex = null;
		isTimeAdvancing = true;

		setTimeout(() => {
			backgroundName = `atlas/${currentRound.atlas.city}`;
			isTimeAdvancing = false;
			resetScene();
		}, RATE_IN_MS);
	}

	async function travelTo(destination: Atlas): Promise<void> {
		resetScene();

		isTimeAdvancing = true;
		isTraveling = true;
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
		setInterval(() => {
			currentTime = clock.getCurrentTime();
			isSleeping = clock.isSleeping;
			timeIsUp = clock.timeIsUp;
		}, clock.tickRate);
	});

	let currentClueIndex: number | null = null;

	let clock = new Clock();
	let currentTime: string;
	let isTraveling: boolean;
	let isSleeping: boolean;
	let timeIsUp: boolean;
	$: isTimeAdvancing = isTraveling || isSleeping;

	let isDepartingTo = false;
	let isLookingForClues = false;

	$: currentRoundIndex = 0;
	$: currentRound = rounds[currentRoundIndex];
	$: isDescriptionVisible = isDepartingTo || isLookingForClues;
	$: isGameWon = !timeIsUp && currentRoundIndex === rounds.length - 1;
	$: backgroundName = `atlas/${currentRound.atlas.city}`;
</script>

<Main>
	<div class="round__background {isTimeAdvancing ? 'round__background--disabled' : ''}">
		<img
			class="round__img"
			src="/artwork/{backgroundName.replace(' ', '-').replace(' ', '-').toLowerCase()}.png"
			alt="Illustration of scene"
		/>
	</div>

	<Header>
		<H1>{isTraveling ? 'Traveling...' : isSleeping ? 'Sleeping...' : currentRound.atlas.city}</H1>
		<time class="round__time {isTimeAdvancing ? 'round__time--active' : ''}">{currentTime}</time>
	</Header>

	{#if !isDescriptionVisible}
		<Section>
			{#if !isTimeAdvancing}
				<P>
					{getRandomValue(currentRound.atlas.descriptions)}
				</P>
			{/if}
		</Section>
	{/if}

	{#if isLookingForClues}
		<Section align="bottom">
			{#if currentClueIndex === null}
				{#if !isTimeAdvancing}
					{#each currentRound.scenes as scene, index}
						<Button active={currentClueIndex === index} on:click={() => findClue(index)}>
							{scene.place}
						</Button>
					{/each}
				{/if}
			{:else}
				<P>
					<strong>{currentRound.scenes[currentClueIndex].witness}</strong><br />
					{currentRound.scenes[currentClueIndex].clue}
				</P>
			{/if}
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
		{:else if currentClueIndex !== null}
			<Button on:click={dismissClue}>Dismiss</Button>
		{:else if !isTimeAdvancing}
			<Button active={isLookingForClues} disabled={isTimeAdvancing} on:click={findClues}>
				Find clues
			</Button>
			<Button active={isDepartingTo} disabled={isTimeAdvancing} on:click={departTo}>
				Depart to
			</Button>
			<Button disabled={true}>Get warrant</Button>
			<ButtonLink href="/">Quit</ButtonLink>
		{/if}
	</Nav>
</Main>

<style lang="scss">
	time.round__time {
		opacity: 0.33;
		transition: opacity 250ms;

		&--active {
			opacity: 1;
		}
	}

	div.round__background {
		position: absolute;
		z-index: -1;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		opacity: 1;
		transition: filter 250ms, opacity 500ms;

		&--disabled {
			filter: grayscale(100%) blur(2px);
			opacity: 0;
		}
	}

	img.round__img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
</style>
