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
	import TerminalForm from '$lib/components/TerminalForm.svelte';
	import TerminalFormSelect from '$lib/components/TerminalFormSelect.svelte';
	import TerminalGroup from '$lib/components/TerminalGroup.svelte';
	import TerminalParagraph from '$lib/components/TerminalParagraph.svelte';
	import TerminalRows from '$lib/components/TerminalRows.svelte';
	import TerminalTitle from '$lib/components/TerminalTitle.svelte';
	import Time from '$lib/components/Time.svelte';
	import TrailingSuspect from '$lib/components/TrailingSuspect.svelte';
	import {
		gameStore,
		type Game,
		type Atlas,
		type Round,
		generateDecoyRound,
		getFormattedTime,
		SUSPECT_TRAIL_SCENE_DURATION
	} from '$lib/game';
	import { delay, getRandomValue, redirectTo } from '$lib/helpers';
	import Back from '$lib/icons/Back.svg.svelte';
	import Collapse from '$lib/icons/Collapse.svg.svelte';
	import Expand from '$lib/icons/Expand.svg.svelte';
	import IconFly from '$lib/icons/Fly.svg.svelte';
	import IconMenu from '$lib/icons/Menu.svg.svelte';
	import IconWalk from '$lib/icons/Walk.svg.svelte';
	import { playerStore } from '$lib/player';
	import {
		Suspect,
		WarrantSex,
		WarrantHobby,
		WarrantHair,
		WarrantFeature,
		WarrantVehicle,
		findSuspects
	} from '$lib/suspects';
	import { onDestroy, onMount } from 'svelte';
	import { fade, slide } from 'svelte/transition';

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
	let isFirstRound: boolean;
	let isLastRound: boolean;
	let isGameOver: boolean;

	let isTrailingSuspect: boolean;
	let trailingSceneInRoundSeen: boolean = false;
	let trailingSuspectScene: keyof Translation['game']['trailingSuspect'];

	let showPostcard = true;
	let showPlaces = false;
	let showDestinations = false;
	let showOptions = false;
	let showDescription = true;
	let showDossiers = false;
	let showWarrant = false;
	let showSuspectDossier: keyof Translation['suspects'] | undefined;

	let warrantWasComputed: boolean = false;
	let warrantSex: WarrantSex | undefined;
	let warrantHobby: WarrantHobby | undefined;
	let warrantHair: WarrantHair | undefined;
	let warrantFeature: WarrantFeature | undefined;
	let warrantVehicle: WarrantVehicle | undefined;

	$: isClockTicking = isSleeping || isWalking || isFlying;
	$: isArtworkHidden = isClockTicking && !isSleeping;
	$: isClueVisible = currentClueIndex !== null && !isWalking && !isSleeping;
	$: canComputeWarrant = warrantSex || warrantHobby || warrantHair || warrantFeature || warrantVehicle; // prettier-ignore

	$: if (game) {
		currentRound = game.roundDecoy ? game.roundDecoy : game.rounds[game.currentRoundIndex];
		if (currentClueIndex === null) artworkPath = currentRound.atlas.artwork;

		game.suspect.caught =
			!isTimeUp && isLastRound && currentClueIndex === game.suspect.lastRoundHidingPlace;

		isFirstRound = game.currentRoundIndex === 0;
		isLastRound = game.currentRoundIndex === game.rounds.length - 1;
		isGameOver = game.suspect.caught || isTimeUp;
	}

	$: if (isGameOver) {
		gameStore.set(game); // Save the game state to localStorage
		redirectTo('/gg/');
	}

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
		warrantWasComputed = true;
		game.warrants = findSuspects(
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

		if (!trailingSceneInRoundSeen && !isFirstRound && game.suspect.lastRoundHidingPlace !== index) {
			isArtworkHidden = true;
			isTrailingSuspect = true;

			const nextSuspectScene = (
				game.currentRoundIndex - 1
			).toString() as keyof Translation['game']['trailingSuspect'];

			trailingSuspectScene = nextSuspectScene;
			await delay(SUSPECT_TRAIL_SCENE_DURATION);

			isTrailingSuspect = false;
			trailingSceneInRoundSeen = true;
		}

		isArtworkHidden = true;
		clock.fastForward(2);
		await delay(DELAY_IN_MS);

		currentClueIndex = index;
		if (currentRound) artworkPath = currentRound.scenes[index].place.artwork;
	}

	async function dismissClue(): Promise<void> {
		isArtworkHidden = true;
		await delay(DELAY_IN_MS);

		resetRound();
		isArtworkHidden = false; // Since clock is not ticking we need to manually show the artwork
	}

	async function setRound(currentAtlas: Atlas): Promise<void> {
		isClockTicking = true;
		clock.isFlying = true;
		showDestinations = false;
		showDescription = false;
		isArtworkHidden = true;
		clock.fastForward(4);
		await delay(DELAY_IN_MS);

		const { rounds, currentRoundIndex } = game;

		const isCurrentRound = rounds[currentRoundIndex].atlas.city === currentAtlas.city;
		const isNextRound = rounds[currentRoundIndex + 1].atlas.city === currentAtlas.city;
		const isPreviousRound =
			currentRoundIndex > 0 && rounds[currentRoundIndex - 1].atlas.city === currentAtlas.city;

		// Decoy rounds are used to throw the player off the trail
		const isDecoyRound = !isCurrentRound && !isPreviousRound && !isNextRound;

		// There should always be a way to return to the round where the suspect trail was lost
		const anchorAtlas = rounds[currentRoundIndex].atlas;

		if (isDecoyRound) {
			currentRound = generateDecoyRound($LL, currentAtlas, anchorAtlas);
			game.roundDecoy = currentRound;
		} else {
			trailingSceneInRoundSeen = false;
			game.roundDecoy = null;
		}

		if (isCurrentRound) currentRound = rounds[currentRoundIndex];
		if (isNextRound) game.currentRoundIndex += 1;
		if (isPreviousRound) game.currentRoundIndex -= 1;

		// Must reset round after transition
		showPostcard = true;
		resetRound();
	}

	function abandonGame(): void {
		if (confirm($LL.game.actions.confirm())) {
			gameStore.set(null);
			redirectTo('/');
		}
	}

	onMount(() => {
		// Can't start the game without $playerStore and $gameStore
		if ($playerStore === null || $gameStore === null) {
			redirectTo('/headquarters/');
			return new Error('No player or game store');
		}

		// Create a local copy of the game state
		game = $gameStore;

		// Try to resume the game from where the player left off
		if (game.currentTime) clock.currentTime = new Date(game.currentTime);

		// Start game loop
		clock.start();

		// Game loop
		gameLoop = setInterval(() => {
			if ($playerStore)
				currentTimeFormatted = getFormattedTime(clock.currentTime, $playerStore.locale);
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

	$: if (game?.warrants) console.log(game.warrants);
</script>

{#if !isLoading}
	<Main>
		<Artwork
			isHighContrast={!showPostcard}
			isHidden={isArtworkHidden}
			isDisabled={isSleeping}
			src={artworkPath}
		/>

		{#if isTrailingSuspect}
			<TrailingSuspect sceneIndex={trailingSuspectScene} sex={game.suspect.warrantKeys.sex} />
		{/if}

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

		<Footer slot="footer">
			{#if !showPostcard}
				{#if !isTimeUp && !isSleeping && !isClockTicking && showDescription}
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
						<Button on:click={abandonGame}>{$LL.game.actions.abandon()}</Button>
					</Section>

					<Section>
						<section class="button-group" in:slide>
							<Button on:click={seeDossiers}>{$LL.warrants.suspectDossiers()}</Button>
							<Button on:click={getWarrant}>{$LL.warrants.getWarrant()}</Button>
						</section>
					</Section>
				{/if}

				{#if showDossiers}
					<TerminalGroup>
						<TerminalRows
							lines={[
								{
									text: `${$LL.warrants.worldPolice()}: ${$LL.warrants.suspectDossiers()}`,
									isTitle: true
								}
							]}
							bind:isAnimating
						/>
						<ul class="terminal-group-buttons" in:slide>
							{#each Object.values(Suspect) as suspectKey}
								<li class="terminal-group-buttons__li">
									<Button on:click={() => seeDossier(suspectKey)} transparent={true}>
										{$LL.suspects[suspectKey].name()}
									</Button>
								</li>
							{/each}
						</ul>
					</TerminalGroup>
				{/if}

				{#if showSuspectDossier}
					{@const suspect = $LL.suspects[showSuspectDossier]}
					{@const warrants = $LL.warrants}
					<TerminalGroup>
						<TerminalRows
							lines={[
								{
									text: `${$LL.warrants.worldPolice()}: ${$LL.warrants.suspectDossiers()}`,
									isTitle: true
								}
							]}
							bind:isAnimating
						/>

						{#if !isAnimating}
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
						{/if}
					</TerminalGroup>
				{/if}

				{#if showWarrant}
					<TerminalGroup>
						<TerminalRows
							lines={[
								{
									text: `${$LL.warrants.worldPolice()}: ${$LL.warrants.warrants()}`,
									isTitle: true
								},
								{ text: $LL.warrants.provideDetails() }
							]}
							bind:isAnimating
						/>

						{#if !isAnimating}
							<TerminalForm>
								<TerminalTitle>{$LL.warrants.labels.sex()}</TerminalTitle>
								<TerminalFormSelect bind:value={warrantSex}>
									{#each Object.values(WarrantSex) as sex}
										<option value={sex}>{$LL.warrants.sex[sex]()}</option>
									{/each}
								</TerminalFormSelect>

								<TerminalTitle>{$LL.warrants.labels.hobby()}</TerminalTitle>
								<TerminalFormSelect bind:value={warrantHobby}>
									{#each Object.values(WarrantHobby) as hobby}
										<option value={hobby}>{$LL.warrants.hobby[hobby]()}</option>
									{/each}
								</TerminalFormSelect>

								<TerminalTitle>{$LL.warrants.labels.hair()}</TerminalTitle>
								<TerminalFormSelect bind:value={warrantHair}>
									{#each Object.values(WarrantHair) as hair}
										<option value={hair}>{$LL.warrants.hair[hair]()}</option>
									{/each}
								</TerminalFormSelect>

								<TerminalTitle>{$LL.warrants.labels.feature()}</TerminalTitle>
								<TerminalFormSelect bind:value={warrantFeature}>
									{#each Object.values(WarrantFeature) as feature}
										<option value={feature}>{$LL.warrants.feature[feature]()}</option>
									{/each}
								</TerminalFormSelect>

								<TerminalTitle>{$LL.warrants.labels.vehicle()}</TerminalTitle>
								<TerminalFormSelect bind:value={warrantVehicle}>
									{#each Object.values(WarrantVehicle) as vehicle}
										<option value={vehicle}>{$LL.warrants.vehicle[vehicle]()}</option>
									{/each}
								</TerminalFormSelect>
							</TerminalForm>

							<ul class="terminal-group-buttons" in:slide>
								<li class="terminal-group-buttons__li">
									<Button
										on:click={computeWarrant}
										disabled={!canComputeWarrant}
										transparent={true}
									>
										{$LL.warrants.compute()}
									</Button>
								</li>
							</ul>

							{#if warrantWasComputed}
								{#if game.warrants.length > 1}
									<TerminalRows
										shouldAutoScroll={true}
										lines={[
											{ text: $LL.warrants.possibleSuspects(), isTitle: true },
											...game.warrants.map((suspect) => ({
												text: $LL.suspects[suspect].name()
											}))
										]}
									/>
								{:else if game.warrants.length > 0}
									<TerminalRows
										shouldAutoScroll={true}
										lines={[
											{ text: $LL.warrants.suspectMatch(), isTitle: true },
											{
												text: $LL.warrants.haveWarrant({
													suspect: $LL.suspects[game.warrants[0]].name()
												})
											}
										]}
									/>
								{:else}
									<TerminalRows
										shouldAutoScroll={true}
										lines={[
											{ text: $LL.warrants.noSuspectsFound(), isTitle: true },
											{ text: $LL.warrants.noPossibleSuspects() }
										]}
									/>
								{/if}
							{/if}
						{/if}
					</TerminalGroup>
				{/if}
			{/if}

			{#if !isClockTicking}
				<nav class="game-nav" transition:fade>
					{#if isClueVisible}
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
						<ButtonIcon on:click={togglePostcard} title={$LL.game.actions.hidePostcard()}>
							<Expand />
						</ButtonIcon>
					{:else}
						<ButtonIcon on:click={togglePostcard} title={$LL.game.actions.showPostcard()}>
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

	ul.terminal-group-buttons {
		list-style: unset;
		padding-inline: unset;
		margin-block: unset;
	}

	li.terminal-group-buttons__li {
		border-top: 1px dashed var(--color-neutral-500);
	}
</style>
