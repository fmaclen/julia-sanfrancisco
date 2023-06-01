<script lang="ts">
	import LL from '$i18n/i18n-svelte';
	import type { Translation } from '$i18n/i18n-types';
	import Clock, { DELAY_IN_MS } from '$lib/clock';
	import Artwork from '$lib/components/Artwork.svelte';
	import Button from '$lib/components/Button.svelte';
	import ButtonIcon from '$lib/components/ButtonIcon.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import H1 from '$lib/components/H1.svelte';
	import Header from '$lib/components/Header.svelte';
	import Main from '$lib/components/Main.svelte';
	import P from '$lib/components/P.svelte';
	import Section from '$lib/components/Section.svelte';
	import type { TerminalRow } from '$lib/components/Terminal';
	import TerminalForm from '$lib/components/TerminalForm.svelte';
	import TerminalFormSelect from '$lib/components/TerminalFormSelect.svelte';
	import TerminalGroup from '$lib/components/TerminalGroup.svelte';
	import TerminalParagraph from '$lib/components/TerminalParagraph.svelte';
	import TerminalRows from '$lib/components/TerminalRows.svelte';
	import TerminalTitle from '$lib/components/TerminalTitle.svelte';
	import Time from '$lib/components/Time.svelte';
	import { gameStore, type Game, type Atlas, type Round, generateDecoyRound } from '$lib/game';
	import { getRandomValue, redirectTo } from '$lib/helpers';
	import Back from '$lib/icons/Back.svg.svelte';
	import Collapse from '$lib/icons/Collapse.svg.svelte';
	import Continue from '$lib/icons/Continue.svg.svelte';
	import Expand from '$lib/icons/Expand.svg.svelte';
	import IconFly from '$lib/icons/Fly.svg.svelte';
	import IconMenu from '$lib/icons/Menu.svg.svelte';
	import IconWalk from '$lib/icons/Walk.svg.svelte';
	import { playerStore, type Player, getCasesUntilPromotion, getRank } from '$lib/player';
	import {
		Suspect,
		WarrantSex,
		WarrantHobby,
		WarrantHair,
		WarrantFeature,
		WarrantVehicle,
		findSuspect
	} from '$lib/suspects';
	import { onDestroy, onMount } from 'svelte';
	import { fade, slide } from 'svelte/transition';
	import type { LocalizedString } from 'typesafe-i18n';

	let playerRank: LocalizedString;

	let game: Game;
	let currentRound: Round;
	let currentClueIndex: number | null = null;
	let artworkPath: string;

	let gameLoop: NodeJS.Timer;
	let clock = new Clock($playerStore?.locale ?? 'en');
	let currentTimeFormatted: string;

	let isLoading = true;
	let isAnimating: boolean;
	let isWalking: boolean;
	let isFlying: boolean;
	let isSleeping: boolean;
	let isTimeUp: boolean;
	let isLastRound: boolean;
	let isGameOver: boolean;

	let hasWarrant: boolean;
	let suspectCaught: boolean;
	let suspectCaughtWithWarrant: boolean;
	let suspectCaughtWithWrongWarrant: boolean;
	let suspectCaughtWithoutWarrant: boolean;
	let suspectGotAway: boolean;

	let showPostcard = true;
	let showPlaces = false;
	let showDestinations = false;
	let showOptions = false;
	let showDescription = true;
	let showDossiers = false;
	let showWarrant = false;
	let showSuspectDossier: keyof Translation['suspects'] | undefined;

	let possibleSuspects: Suspect[] = [];
	let warrantSex: WarrantSex | undefined;
	let warrantHobby: WarrantHobby | undefined;
	let warrantHair: WarrantHair | undefined;
	let warrantFeature: WarrantFeature | undefined;
	let warrantVehicle: WarrantVehicle | undefined;

	let outcomeSuspectCaughtWithWarrant: TerminalRow[][] = [];
	let outcomeSuspectCaughtWithWrongWarrant: TerminalRow[][] = [];
	let outcomeSuspectCaughtWithoutWarrant: TerminalRow[][] = [];
	let outcomeSuspectGotAway: TerminalRow[][] = [];

	$: isClockTicking = isSleeping || isWalking || isFlying;
	$: isArtworkHidden = isClockTicking && !isSleeping;
	$: isClueVisible = currentClueIndex !== null && !isWalking && !isSleeping && !isGameOver;
	$: isGameOver = suspectCaughtWithWarrant || suspectCaughtWithWrongWarrant || suspectCaughtWithoutWarrant || suspectGotAway; // prettier-ignore
	$: canComputeWarrant = warrantSex || warrantHobby || warrantHair || warrantFeature || warrantVehicle; // prettier-ignore

	function resetRound(): void {
		currentClueIndex = null;
		artworkPath = currentRound.atlas.artwork;
		game.currentTime = clock.currentTime;

		showDescription = true;
		showPlaces = false;
		showOptions = false;
		showDestinations = false;
		showDossiers = false;
		showWarrant = false;
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

	function getWarrant(): void {
		showOptions = false;
		showWarrant = true;
	}

	function computeWarrant(): void {
		possibleSuspects = [];
		possibleSuspects = findSuspect(
			warrantSex,
			warrantHobby,
			warrantHair,
			warrantFeature,
			warrantVehicle
		);
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
		if (suspectCaughtWithWarrant) {
			playerStore.update((player: Player | null) => {
				player ? (player.score += 1) : null;
				return player;
			});
		}

		redirectTo('/headquarters/');
	}

	function abandonGame(): void {
		if (confirm($LL.game.actions.confirm())) {
			gameStore.set(null);
			redirectTo('/');
		}
	}

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
		gameLoop = setInterval(() => {
			currentTimeFormatted = clock.getFormattedTime();
			isWalking = clock.isWalking;
			isFlying = clock.isFlying;
			isSleeping = clock.isSleeping;
			isTimeUp = clock.isTimeUp;
		}, clock.tickRate);

		isLoading = false;
	});

	onDestroy(() => {
		clearInterval(gameLoop);
	});

	$: if (game) {
		currentRound = game.roundDecoy ? game.roundDecoy : game.rounds[game.currentRoundIndex];
		if (currentClueIndex === null) artworkPath = currentRound.atlas.artwork;

		isLastRound = game.currentRoundIndex === game.rounds.length - 1;
		hasWarrant = possibleSuspects.length === 1;
		suspectCaught = !isClockTicking && !isTimeUp && isLastRound && currentClueIndex === game.suspect.lastRoundHidingPlace; // prettier-ignore
		suspectCaughtWithWarrant = suspectCaught && hasWarrant && possibleSuspects[0] === game.suspect.key; // prettier-ignore
		suspectCaughtWithWrongWarrant = suspectCaught && hasWarrant && possibleSuspects[0] !== game.suspect.key; // prettier-ignore
		suspectCaughtWithoutWarrant = suspectCaught && !hasWarrant && possibleSuspects[0] !== game.suspect.key; // prettier-ignore
		suspectGotAway = !isClockTicking && isTimeUp && !isLastRound;

		outcomeSuspectCaughtWithWarrant = [
			[
				{ text: $LL.game.outcome.title(), isTitle: true },
				{ text: $LL.game.outcome.caughtWithWarrant[0]({ city: game.rounds[0].atlas.city, suspect: game.suspect.name }) }, // prettier-ignore
				{ text: $LL.game.outcome.caughtWithWarrant[1]({ suspect: game.suspect.name, stolenTreasure: game.stolenTreasure, city: game.rounds[0].atlas.city }) } // prettier-ignore
			],
			[
				{ text: $LL.game.outcome.caughtWithWarrant[2]() },
				{ text: $LL.game.outcome.caughtWithWarrant[3]() },
				{ text: $LL.game.outcome.caughtWithWarrant[4]({ cases: getCasesUntilPromotion($playerStore!.score) }) } // prettier-ignore
			],
			[{ text: $LL.game.outcome.ready({ rank: playerRank, name: $playerStore!.name }) }]
		];

		outcomeSuspectCaughtWithWrongWarrant = [
			[
				{ text: $LL.game.outcome.title(), isTitle: true },
				{ text: $LL.game.outcome.caughtWithWrongWarrant[0]({ suspect: game.suspect.name }) }, // prettier-ignore
				{ text: $LL.game.outcome.caughtWithWrongWarrant[1]({ suspect: $LL.suspects[possibleSuspects[0]].name() }) } // prettier-ignore
			],
			[
				{ text: $LL.game.outcome.caughtWithWrongWarrant[2]() },
				{ text: $LL.game.outcome.caughtWithWrongWarrant[3]() }
			],
			[{ text: $LL.game.outcome.ready({ rank: playerRank, name: $playerStore!.name }) }]
		];

		outcomeSuspectCaughtWithoutWarrant = [
			[
				{ text: $LL.game.outcome.title(), isTitle: true },
				{ text: $LL.game.outcome.caughtWithoutWarrant[0]({ suspect: game.suspect.name }) }, // prettier-ignore
				{ text: $LL.game.outcome.caughtWithoutWarrant[1]() }
			],
			[{ text: $LL.game.outcome.caughtWithoutWarrant[2]() }],
			[{ text: $LL.game.outcome.ready({ rank: playerRank, name: $playerStore!.name }) }]
		];

		outcomeSuspectGotAway = [
			[
				{ text: $LL.game.outcome.title(), isTitle: true },
				{ text: $LL.game.outcome.gotAway[0]() },
				{ text: $LL.game.outcome.gotAway[1]({ suspect: game.suspect.name }) }
			],
			[{ text: $LL.game.outcome.ready({ rank: playerRank, name: $playerStore!.name }) }]
		];
	}
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
			{#if suspectCaughtWithWarrant}
				<TerminalGroup>
					<TerminalRows lines={outcomeSuspectCaughtWithWarrant[0]} bind:isAnimating />
					<TerminalRows lines={outcomeSuspectCaughtWithWarrant[1]} bind:isAnimating />
					<TerminalRows lines={outcomeSuspectCaughtWithWarrant[2]} bind:isAnimating />
					<TerminalRows lines={outcomeSuspectCaughtWithWarrant[3]} bind:isAnimating />
				</TerminalGroup>
			{/if}

			{#if suspectCaughtWithWrongWarrant}
				<TerminalGroup>
					<TerminalRows lines={outcomeSuspectCaughtWithWrongWarrant[0]} bind:isAnimating />
					<TerminalRows lines={outcomeSuspectCaughtWithWrongWarrant[1]} bind:isAnimating />
					<TerminalRows lines={outcomeSuspectCaughtWithWrongWarrant[2]} bind:isAnimating />
					<TerminalRows lines={outcomeSuspectCaughtWithWrongWarrant[3]} bind:isAnimating />
				</TerminalGroup>
			{/if}

			{#if suspectCaughtWithoutWarrant}
				<TerminalGroup>
					<TerminalRows lines={outcomeSuspectCaughtWithoutWarrant[0]} bind:isAnimating />
					<TerminalRows lines={outcomeSuspectCaughtWithoutWarrant[1]} bind:isAnimating />
					<TerminalRows lines={outcomeSuspectCaughtWithoutWarrant[2]} bind:isAnimating />
					<TerminalRows lines={outcomeSuspectCaughtWithoutWarrant[3]} bind:isAnimating />
				</TerminalGroup>
			{/if}

			{#if suspectGotAway}
				<TerminalGroup>
					<TerminalRows lines={outcomeSuspectGotAway[0]} bind:isAnimating />
					<TerminalRows lines={outcomeSuspectGotAway[1]} bind:isAnimating />
					<TerminalRows lines={outcomeSuspectGotAway[2]} bind:isAnimating />
				</TerminalGroup>
			{/if}

			{#if !showPostcard}
				{#if !isTimeUp && !suspectCaughtWithWarrant && !isSleeping && !isClockTicking && showDescription}
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
							<Button on:click={abandonGame}>{$LL.game.actions.abandon()}</Button>
							<Button on:click={seeDossiers}>{$LL.warrants.suspectDossiers()}</Button>
							<Button on:click={getWarrant}>{$LL.warrants.getWarrant()}</Button>
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

				{#if showSuspectDossier}
					{@const suspect = $LL.suspects[showSuspectDossier]}
					{@const warrants = $LL.warrants}
					<TerminalGroup>
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

				{#if showWarrant}
					{@const warrants = $LL.warrants}
					<TerminalGroup>
						<TerminalRows
							lines={[
								{ text: 'World Police: Warrants', isTitle: true },
								{ text: warrants.provideDetails() }
							]}
						/>

						<TerminalForm>
							<TerminalTitle>{warrants.labels.sex()}</TerminalTitle>
							<TerminalFormSelect bind:value={warrantSex}>
								{#each Object.values(WarrantSex) as sex}
									<option value={sex}>{warrants.sex[sex]()}</option>
								{/each}
							</TerminalFormSelect>

							<TerminalTitle>{warrants.labels.hobby()}</TerminalTitle>
							<TerminalFormSelect bind:value={warrantHobby}>
								{#each Object.values(WarrantHobby) as hobby}
									<option value={hobby}>{warrants.hobby[hobby]()}</option>
								{/each}
							</TerminalFormSelect>

							<TerminalTitle>{warrants.labels.hair()}</TerminalTitle>
							<TerminalFormSelect bind:value={warrantHair}>
								{#each Object.values(WarrantHair) as hair}
									<option value={hair}>{warrants.hair[hair]()}</option>
								{/each}
							</TerminalFormSelect>

							<TerminalTitle>{warrants.labels.feature()}</TerminalTitle>
							<TerminalFormSelect bind:value={warrantFeature}>
								{#each Object.values(WarrantFeature) as feature}
									<option value={feature}>{warrants.feature[feature]()}</option>
								{/each}
							</TerminalFormSelect>

							<TerminalTitle>{warrants.labels.vehicle()}</TerminalTitle>
							<TerminalFormSelect bind:value={warrantVehicle}>
								{#each Object.values(WarrantVehicle) as vehicle}
									<option value={vehicle}>{warrants.vehicle[vehicle]()}</option>
								{/each}
							</TerminalFormSelect>
						</TerminalForm>

						{#if possibleSuspects.length > 1}
							<TerminalRows
								lines={[
									{ text: warrants.possibleSuspects(), isTitle: true },
									...possibleSuspects.map((suspect) => ({
										text: $LL.suspects[suspect].name()
									}))
								]}
							/>
						{:else if possibleSuspects.length > 0}
							<TerminalRows
								lines={[
									{ text: warrants.suspectMatch(), isTitle: true },
									{
										text: warrants.haveWarrant({
											suspect: $LL.suspects[possibleSuspects[0]].name()
										})
									}
								]}
							/>
						{/if}
					</TerminalGroup>

					<Section>
						<Button on:click={computeWarrant} disabled={!canComputeWarrant}>
							{warrants.compute()}
						</Button>
					</Section>
				{/if}
			{/if}

			{#if !isClockTicking}
				<nav class="game-nav" transition:fade>
					{#if isGameOver}
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
					{:else if showWarrant}
						<ButtonIcon on:click={toggleOptions} title={$LL.components.buttons.goBack()}>
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
		max-height: 50dvh;
		overflow-y: auto;
	}
</style>
