<script lang="ts">
	import LL from '$i18n/i18n-svelte';
	import Clock, { DELAY_IN_MS } from '$lib/clock';
	import Artwork from '$lib/components/Artwork.svelte';
	import Button from '$lib/components/Button.svelte';
	import H1 from '$lib/components/H1.svelte';
	import Header from '$lib/components/Header.svelte';
	import P from '$lib/components/P.svelte';
	import Section from '$lib/components/Section.svelte';
	import type { TerminalLine, TerminalRow } from '$lib/components/Terminal';
	import Terminal from '$lib/components/Terminal.svelte';
	import Time from '$lib/components/Time.svelte';
	import {
		gameStore,
		type Game,
		type Atlas,
		type Round,
		generateDecoyRound,
		Suspect
	} from '$lib/game';
	import { getRandomValue, redirectTo } from '$lib/helpers';
	import IconFly from '$lib/icons/Fly.svg.svelte';
	import IconMenu from '$lib/icons/Menu.svg.svelte';
	import IconWalk from '$lib/icons/Walk.svg.svelte';
	import { playerStore, type Player, getCasesUntilPromotion, getRank } from '$lib/player';
	import type { Translation } from '../../i18n/i18n-types';
	import ButtonIcon from '../../lib/components/ButtonIcon.svelte';
	import Footer from '../../lib/components/Footer.svelte';
	import Main from '../../lib/components/Main.svelte';
	import TerminalForm from '../../lib/components/TerminalForm.svelte';
	import TerminalFormInput from '../../lib/components/TerminalFormInput.svelte';
	import TerminalGroup from '../../lib/components/TerminalGroup.svelte';
	import TerminalParagraph from '../../lib/components/TerminalParagraph.svelte';
	import TerminalRows from '../../lib/components/TerminalRows.svelte';
	import TerminalTitle from '../../lib/components/TerminalTitle.svelte';
	import H3 from '../../lib/components/TerminalTitle.svelte';
	import Back from '../../lib/icons/Back.svg.svelte';
	import Collapse from '../../lib/icons/Collapse.svg.svelte';
	import Continue from '../../lib/icons/Continue.svg.svelte';
	import Expand from '../../lib/icons/Expand.svg.svelte';
	import { onMount } from 'svelte';
	import { fade, slide } from 'svelte/transition';
	import type { LocalizedString } from 'typesafe-i18n';

	function resetRound(): void {
		currentClueIndex = null;
		artworkPath = currentRound.atlas.artwork;
		game.currentTime = clock.currentTime;

		showDescription = true;
		showPlaces = false;
		showOptions = false;
		showDestinations = false;
		showDossiers = false;
		showSuspectDossier = undefined;

		gameStore.set(game); // Save the game state to localStorage
	}

	function flyTo(): void {
		if (!showDestinations) resetRound();
		showDescription = !showDescription;
		showDestinations = !showDestinations;
	}

	function walkTo(): void {
		if (!showPlaces) resetRound();
		showDescription = !showDescription;
		showPlaces = !showPlaces;
	}

	function toggleOptions(): void {
		if (!showOptions) resetRound();
		showDescription = !showDescription;
		showOptions = !showOptions;
	}

	function togglePostcard(): void {
		showPostcard = !showPostcard;
	}

	function seeDossiers(): void {
		showOptions = false;
		showSuspectDossier = undefined;
		showDossiers = true;
	}

	function seeDossier(suspect: Suspect): void {
		showDossiers = false;
		showSuspectDossier = suspect;
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
		isClockTicking = true;
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
			showPostcard = true;
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

	function abandonGame(): void {
		if (confirm($LL.game.actions.confirm())) {
			gameStore.set(null);
			redirectTo('/');
		}
	}

	let playerRank: LocalizedString;

	let game: Game;
	let currentRound: Round;
	let currentClueIndex: number | null = null;
	let artworkPath: string;

	let clock = new Clock($playerStore?.locale ?? 'en');
	let currentTimeFormatted: string;

	let isLoading = true;
	let isAnimating: boolean;
	let isWalking: boolean;
	let isFlying: boolean;
	let isSleeping: boolean;
	let isTimeUp: boolean;
	let isGameWon: boolean;
	let isGameLost: boolean;

	let showPostcard = false; // DEBUG: REVERTME BEFORE MERGING
	let showPlaces = false;
	let showDestinations = false;
	let showOptions = false;
	let showDescription = true;
	let showDossiers = false;
	let showSuspectDossier: keyof Translation['suspects'] | undefined;

	let outcomeWon: TerminalRow[] = [];
	let outcomeTimedUp: TerminalRow[] = [];

	onMount(() => {
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
		artworkPath = currentRound.atlas.artwork;

		isGameWon = !isClockTicking && !isTimeUp && game.currentRoundIndex === game.rounds.length - 1;
		isGameLost = !isClockTicking && isTimeUp && game.currentRoundIndex !== game.rounds.length - 1;

		outcomeWon = [
			{ text: $LL.game.outcome.title(), isTitle: true },
			{ text: $LL.game.outcome.win.line1() },
			{ text: $LL.game.outcome.win.line2() },
			{ text: $LL.game.outcome.win.line3({ city: game.rounds[0].atlas.city, suspect: game.suspect.name }) }, // prettier-ignore
			{ text: $LL.game.outcome.win.line4() },
			{ text: $LL.game.outcome.win.line5({ cases: getCasesUntilPromotion($playerStore!.score) }) }, // prettier-ignore
			{ text: $LL.game.outcome.ready({ rank: playerRank, name: $playerStore!.name }) } // prettier-ignore
		];

		outcomeTimedUp = [
			{ text: $LL.game.outcome.title(), isTitle: true },
			{ text: $LL.game.outcome.loose.timedOut.line1() },
			{ text: $LL.game.outcome.loose.timedOut.line2({ suspect: game.suspect.name }) }, // prettier-ignore
			{ text: $LL.game.outcome.ready({ rank: playerRank, name: $playerStore!.name }) } // prettier-ignore
		];
	}

	$: isClockTicking = isSleeping || isWalking || isFlying;
	$: isArtworkHidden = isClockTicking && !isSleeping;
	$: isClueVisible = currentClueIndex !== null && !isWalking && !isSleeping;
</script>

{#if !isLoading}
	<Main>
		<Header slot="header">
			<H1>
				{isSleeping
					? $LL.game.actions.sleeping() + '...'
					: isFlying
					? $LL.game.actions.flying() + '...'
					: isWalking
					? $LL.game.actions.walking() + '...'
					: currentRound.atlas.city}
			</H1>

			{#if isClockTicking || !showPostcard}
				<Time {isClockTicking} currentTime={currentTimeFormatted} />
			{/if}
		</Header>

		<Artwork
			isHighContrast={!showPostcard}
			isHidden={isArtworkHidden}
			isDisabled={isSleeping}
			src={artworkPath}
		/>

		<Footer slot="footer">
			{#if isGameWon}
				<TerminalGroup>
					<TerminalRows lines={outcomeWon} bind:isAnimating />
				</TerminalGroup>
			{/if}

			{#if isGameLost}
				<TerminalGroup>
					<TerminalRows lines={outcomeTimedUp} bind:isAnimating />
				</TerminalGroup>
			{/if}

			{#if showSuspectDossier}
				{@const suspect = $LL.suspects[showSuspectDossier]}
				{@const warrants = $LL.warrants}
				<TerminalGroup>
					<TerminalForm>
						<TerminalTitle>World Police: Dossier</TerminalTitle>
					</TerminalForm>

					<TerminalForm>
						<TerminalTitle>{warrants.labels.name()}</TerminalTitle>
						<TerminalParagraph>{suspect.name()}</TerminalParagraph>

						<TerminalTitle>{warrants.labels.sex()}</TerminalTitle>
						<TerminalParagraph>{suspect.sex()}</TerminalParagraph>

						<TerminalTitle>{warrants.labels.occupation()}</TerminalTitle>
						<TerminalParagraph>{suspect.occupation()}</TerminalParagraph>

						<TerminalTitle>{warrants.labels.hobby()}</TerminalTitle>
						<TerminalParagraph>{suspect.hobby()}</TerminalParagraph>

						<TerminalTitle>{warrants.labels.hair()}</TerminalTitle>
						<TerminalParagraph>{suspect.hair()}</TerminalParagraph>

						<TerminalTitle>{warrants.labels.vehicle()}</TerminalTitle>
						<TerminalParagraph>{suspect.vehicle()}</TerminalParagraph>

						<TerminalTitle>{warrants.labels.feature()}</TerminalTitle>
						<TerminalParagraph>{suspect.feature()}</TerminalParagraph>

						<TerminalTitle>{warrants.labels.other()}</TerminalTitle>
						<TerminalParagraph>{suspect.other()}</TerminalParagraph>
					</TerminalForm>
				</TerminalGroup>
			{/if}

			{#if !showPostcard}
				{#if !isTimeUp && !isGameWon && !isSleeping && !isClockTicking && showDescription}
					<Section>
						<section class="paragraph-group" in:fade>
							<P>{getRandomValue(currentRound.atlas.descriptions)}</P>
						</section>
					</Section>
				{/if}

				{#if showPlaces}
					<Section>
						<section class="button-group" in:slide>
							{#each currentRound.scenes as scene, index}
								<Button active={currentClueIndex === index} on:click={() => getClue(index)}>
									{scene.place.name}
								</Button>
							{/each}
						</section>
					</Section>
				{/if}

				{#if isClueVisible && currentClueIndex !== null}
					{@const suspectClue = currentRound.scenes[currentClueIndex].suspectClue}
					<Section>
						<section class="paragraph-group">
							<P><strong>{currentRound.scenes[currentClueIndex].witness}</strong></P>
							<P>{currentRound.scenes[currentClueIndex].clue}</P>

							{#if suspectClue}
								<P>{suspectClue}</P>
							{/if}
						</section>
					</Section>
				{/if}

				{#if showDestinations}
					<Section>
						<section class="button-group" in:slide>
							{#each Array.from(currentRound.destinations) as destination}
								<Button on:click={() => setRound(destination)}>
									{destination.city}
								</Button>
							{/each}
						</section>
					</Section>
				{/if}

				{#if showOptions}
					<Section>
						<section class="button-group" in:slide>
							<Button on:click={abandonGame}>
								{$LL.game.actions.abandon()}
							</Button>
							<Button on:click={seeDossiers}>{$LL.warrants.suspectDossiers()}</Button>
							<Button disabled={true}>{$LL.warrants.getWarrant()}</Button>
						</section>
					</Section>
				{/if}

				{#if showDossiers}
					<Section>
						<section class="button-group" in:slide>
							{#each Object.values(Suspect) as suspectKey}
								<Button on:click={() => seeDossier(suspectKey)}>
									{$LL.suspects[suspectKey].name()}
								</Button>
							{/each}
						</section>
					</Section>
				{/if}
			{/if}

			{#if !isClockTicking}
				<nav class="game-nav" transition:fade>
					{#if isGameWon}
						<ButtonIcon on:click={updateScore} title={$LL.components.buttons.continue()}>
							<Continue />
						</ButtonIcon>
					{:else if isClueVisible}
						<ButtonIcon on:click={dismissClue} title={$LL.components.buttons.goBack()}>
							<Back />
						</ButtonIcon>
					{:else if showDossiers}
						<ButtonIcon on:click={toggleOptions} title={$LL.components.buttons.goBack()}>
							<Back />
						</ButtonIcon>
					{:else if showSuspectDossier}
						<ButtonIcon on:click={seeDossiers} title={$LL.components.buttons.goBack()}>
							<Back />
						</ButtonIcon>
					{:else if showPostcard}
						<ButtonIcon on:click={togglePostcard} title="Hide postcard">
							<Expand />
						</ButtonIcon>
					{:else}
						<ButtonIcon on:click={togglePostcard} title="Show postcard">
							<Collapse />
						</ButtonIcon>
						<ButtonIcon
							on:click={walkTo}
							active={isWalking || showPlaces}
							title={$LL.game.actions.walk()}
						>
							<IconWalk />
						</ButtonIcon>
						<ButtonIcon
							on:click={flyTo}
							active={isFlying || showDestinations}
							title={$LL.game.actions.fly()}
						>
							<IconFly />
						</ButtonIcon>
						<ButtonIcon
							on:click={toggleOptions}
							title={$LL.game.actions.options()}
							active={showOptions}
						>
							<IconMenu />
						</ButtonIcon>
					{/if}
				</nav>
			{/if}
		</Footer>
	</Main>
{/if}

<style lang="scss">
	nav.game-nav {
		display: flex;
		justify-content: space-between;
		margin-inline: var(--layout-inline);
	}

	section.button-group {
		display: flex;
		flex-direction: column;
		width: 100%;
		gap: 4px;
		max-height: 45dvh;
		overflow-y: auto;
	}
</style>
