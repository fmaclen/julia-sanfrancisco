<script lang="ts">
	import { ATLASES, getRandomAtlas, type Atlas } from '$lib/atlases';
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
	import { format } from 'date-fns';

	interface Game {
		currentTime: Date;
		stolenTreasure: string;
		suspect: Suspect;
		rounds: Round[];
	}

	// If there is no user profile, redirect to the player page
	if ($playerStore === null) redirectTo('/player/');

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
		isDepartingTo = !isDepartingTo;
		isLookingForClues = false;
	}

	function findClues(): void {
		isLookingForClues = !isLookingForClues;
		isDepartingTo = false;
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

<Main>
	<div class="round__background">
		<img
			src="/locations/{currentRound.atlas.city
				.replace(' ', '-')
				.replace(' ', '-')
				.toLowerCase()}.png"
			alt="Illustration of {currentRound.atlas.city}"
		/>
	</div>

	<Header>
		<H1>{currentRound.atlas.city}</H1>
		<time class="round__time">{format(game.currentTime, 'EEEE hh:mm aaa')}</time>
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

		> img {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
	}
</style>
