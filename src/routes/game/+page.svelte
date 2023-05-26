<script lang="ts">
	import LL from '$i18n/i18n-svelte';
	import Clock, { DELAY_IN_MS } from '$lib/clock';
	import Artwork from '$lib/components/Artwork.svelte';
	import Button from '$lib/components/Button.svelte';
	import ButtonLink from '$lib/components/ButtonLink.svelte';
	import H1 from '$lib/components/H1.svelte';
	import Header from '$lib/components/Header.svelte';
	import Main from '$lib/components/Main.svelte';
	import Nav from '$lib/components/Nav.svelte';
	import P from '$lib/components/P.svelte';
	import Section from '$lib/components/Section.svelte';
	import type { TerminalLine } from '$lib/components/Terminal';
	import Terminal from '$lib/components/Terminal.svelte';
	import Time from '$lib/components/Time.svelte';
	import { gameStore, type Game, type Atlas, type Round, generateDecoyRound } from '$lib/game';
	import { getRandomValue, redirectTo } from '$lib/helpers';
	import IconFly from '$lib/icons/Fly.svg.svelte';
	import IconMenu from '$lib/icons/Menu.svg.svelte';
	import IconWalk from '$lib/icons/Walk.svg.svelte';
	import { playerStore, type Player, getCasesUntilPromotion, getRank } from '$lib/player';
	import { onMount } from 'svelte';
	import type { LocalizedString } from 'typesafe-i18n';

	function resetRound(): void {
		showDescription = true;
		showPlaces = false;
		showOptions = false;
		showDestinations = false;
		currentClueIndex = null;
		artworkPath = currentRound.atlas.artwork;
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

	function toggleOptions(): void {
		if (!showOptions) resetRound();
		showOptions = !showOptions;
	}

	async function getClue(index: number): Promise<void> {
		showPlaces = false;
		showDescription = false;
		clock.isWalking = true;

		transitionTo(() => {
			currentClueIndex = index;
			if (currentRound) artworkPath = currentRound.scenes[index].place.artwork;
		});

		await clock.fastForward(2);
	}

	function dismissClue(): void {
		transitionTo(() => {
			resetRound();
			isArtworkHidden = false; // Since clock is not ticking we need to manually show the artwork
		});
	}

	async function setRound(currentAtlas: Atlas): Promise<void> {
		showDestinations = false;
		showDescription = false;
		clock.isFlying = true;

		transitionTo(() => {
			const { rounds, currentRoundIndex } = game;

			const isCurrentRound = rounds[currentRoundIndex].atlas.city === currentAtlas.city;
			const isNextRound = rounds[currentRoundIndex + 1].atlas.city === currentAtlas.city;
			const isPreviousRound =
				currentRoundIndex > 0 && rounds[currentRoundIndex - 1].atlas.city === currentAtlas.city;

			if (isCurrentRound) currentRound = rounds[currentRoundIndex];
			if (isNextRound) game.currentRoundIndex += 1;
			if (isPreviousRound) game.currentRoundIndex -= 1;

			// Decoy rounds are used to throw the player off the trail
			const isDecoyRound = !isCurrentRound && !isPreviousRound && !isNextRound;

			// There should always be a way to return to the round where the suspect trail was lost
			const anchorAtlas = rounds[currentRoundIndex].atlas;
			if (isDecoyRound) {
				currentRound = generateDecoyRound($LL, currentAtlas, anchorAtlas);

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

	function abandonGame(): void {
		if (confirm($LL.game.actions.confirm())) {
			gameStore.set(null);
			redirectTo('/headquarters/');
		}
	}

	let playerRank: LocalizedString;

	let game: Game;
	let currentRound: Round;
	let currentClueIndex: number | null = null;

	let clock = new Clock($playerStore?.locale ?? 'en');
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
	let showOptions = false;
	let showDescription = true;

	let outcomeWon: TerminalLine[] = [];
	let outcomeTimedUp: TerminalLine[] = [];

	onMount(() => {
		// Load game state from localStorage

		// Can't start the game without $playerStore and $gameStore
		// Redirect back to HQ to generate them
		if ($playerStore === null || $gameStore === null) {
			redirectTo('/headquarters/');
			return new Error('No player or game store');
		}

		// Set the localized rank
		const playerRankIndex = getRank($playerStore.score);
		playerRank = $LL.player.ranks[playerRankIndex]();

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

	$: if (game) {
		currentRound = game.roundDecoy ? game.roundDecoy : game.rounds[game.currentRoundIndex];
		isGameWon = !isTimeUp && game.currentRoundIndex === game.rounds.length - 1;
		artworkPath = currentRound.atlas.artwork;

		outcomeWon = [
			{
				text: $LL.game.outcome.title(),
				type: 'title'
			},
			{
				text: $LL.game.outcome.win.line1()
			},
			{
				text: $LL.game.outcome.win.line2()
			},
			{
				text: $LL.game.outcome.win.line3({
					city: game.rounds[0].atlas.city,
					suspect: game.suspect.name
				})
			},
			{
				text: $LL.game.outcome.win.line4()
			},
			{
				text: $LL.game.outcome.win.line5({
					cases: getCasesUntilPromotion($playerStore!.score)
				})
			},
			{
				type: 'line-break'
			},
			{
				text: $LL.game.outcome.ready({
					rank: playerRank,
					name: $playerStore!.name
				})
			}
		];

		outcomeTimedUp = [
			{
				text: $LL.game.outcome.title(),
				type: 'title'
			},
			{
				text: $LL.game.outcome.loose.timedOut.line1()
			},
			{
				text: $LL.game.outcome.loose.timedOut.line2({ suspect: game.suspect.name })
			},
			{
				type: 'line-break'
			},
			{
				text: $LL.game.outcome.ready({
					rank: playerRank,
					name: $playerStore!.name
				})
			}
		];
	}

	$: isClockTicking = isSleeping || isWalking || isFlying;
	$: isArtworkHidden = isClockTicking && !isSleeping;
	$: isClueVisible = currentClueIndex !== null && !isWalking && !isSleeping;
</script>

<Main>
	{#if isLoading}
		<Section>
			<P>{$LL.components.loading()}...</P>
		</Section>
	{:else if currentRound}
		<Artwork isHidden={isArtworkHidden} isDisabled={isSleeping} src={artworkPath} />

		<Header>
			<H1>
				{isSleeping
					? $LL.game.actions.sleeping() + '...'
					: isFlying
					? $LL.game.actions.flying() + '...'
					: isWalking
					? $LL.game.actions.walking() + '...'
					: currentRound.atlas.city}
			</H1>
			<Time {isClockTicking} currentTime={currentTimeFormatted} />
		</Header>

		<Section>
			{#if !isClockTicking}
				{#if isGameWon}
					<Terminal lines={outcomeWon} />
				{:else if isTimeUp}
					<Terminal lines={outcomeTimedUp} />
				{:else if showDescription}
					<P>
						{getRandomValue(currentRound.atlas.descriptions)}
					</P>
				{/if}
			{/if}
		</Section>

		<Section align="bottom">
			{#if showPlaces}
				{#each currentRound.scenes as scene, index}
					<Button active={currentClueIndex === index} on:click={() => getClue(index)}>
						{scene.place.name}
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

			{#if showOptions}
				<Button on:click={abandonGame}>
					{$LL.game.actions.abandon()}
				</Button>
				<Button disabled={true}>{$LL.game.actions.getWarrant()}</Button>
			{/if}
		</Section>

		<Nav>
			{#if !isClockTicking}
				{#if isGameWon}
					<Button on:click={updateScore}>{$LL.components.buttons.continue()}</Button>
				{:else if isClueVisible}
					<Button on:click={dismissClue}>{$LL.components.buttons.goBack()}</Button>
				{:else}
					<Button
						active={isWalking || showPlaces}
						title={$LL.game.actions.walk()}
						on:click={walkTo}
					>
						<IconWalk />
					</Button>
					<Button
						active={isFlying || showDestinations}
						title={$LL.game.actions.fly()}
						on:click={flyTo}
					>
						<IconFly />
					</Button>
					<Button title={$LL.game.actions.options()} active={showOptions} on:click={toggleOptions}>
						<IconMenu />
					</Button>
				{/if}
			{/if}
		</Nav>
	{/if}
</Main>

