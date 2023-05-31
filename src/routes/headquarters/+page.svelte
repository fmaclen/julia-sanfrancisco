<script lang="ts">
	import LL, { locale } from '$i18n/i18n-svelte';
	import Artwork from '$lib/components/Artwork.svelte';
	import H1 from '$lib/components/H1.svelte';
	import Header from '$lib/components/Header.svelte';
	import Main from '$lib/components/Main.svelte';
	import type { TerminalRow } from '$lib/components/Terminal';
	import Time from '$lib/components/Time.svelte';
	import { gameStore, generateGame } from '$lib/game';
	import { getRank } from '$lib/player';
	import { playerStore } from '$lib/player';
	import ButtonIcon from '../../lib/components/ButtonIcon.svelte';
	import Footer from '../../lib/components/Footer.svelte';
	import TerminalForm from '../../lib/components/TerminalForm.svelte';
	import TerminalFormInput from '../../lib/components/TerminalFormInput.svelte';
	import TerminalGroup from '../../lib/components/TerminalGroup.svelte';
	import TerminalRows from '../../lib/components/TerminalRows.svelte';
	import TerminalTitle from '../../lib/components/TerminalTitle.svelte';
	import { getRandomValue, redirectTo } from '../../lib/helpers';
	import Continue from '../../lib/icons/Continue.svg.svelte';
	import { onMount } from 'svelte';

	// Headquarters always starts a new game
	gameStore.set(null);

	enum Step {
		UNKNOWN_PLAYER,
		KNOWN_PLAYER,
		NEWS_FLASH,
		ASSIGNMENT
	}

	let isLoading = true;
	let isAnimating = false;
	let step: Step;
	let playerName: string;
	let playerRank: string;

	function setPlayer() {
		playerStore.set({ name: playerName, score: 0, locale: $locale });
	}

	function nextStep() {
		if (!$playerStore) {
			setPlayer();
		} else if (!$gameStore) {
			const newGame = generateGame($LL);
			gameStore.set(newGame);
			step = Step.NEWS_FLASH;
		} else if (step === Step.KNOWN_PLAYER) {
			step = Step.NEWS_FLASH;
		} else if (step === Step.NEWS_FLASH) {
			step = Step.ASSIGNMENT;
		} else if (step === Step.ASSIGNMENT) {
			redirectTo('/game');
		}
	}

	onMount(() => {
		isLoading = false;
	});

	let linesUnknownPlayer: TerminalRow[] = [];
	let linesUnknownPlayerInput: TerminalRow[] = [];
	let linesKnownPlayer: TerminalRow[] = [];
	let linesNewsFlash: TerminalRow[] = [];
	let linesAssignment: TerminalRow[] = [];

	if ($playerStore && $gameStore) {
		step = Step.KNOWN_PLAYER;
	}

	$: {
		if (!$playerStore) {
			linesUnknownPlayer = [
				{ id: Step.UNKNOWN_PLAYER, text: $LL.headquarters.id.acmeSystems(), isTitle: true },
				{ text: $LL.headquarters.id.pending() }
			];

			linesUnknownPlayerInput = [{ text: $LL.headquarters.id.yourName(), isTitle: true }];

			step = Step.UNKNOWN_PLAYER;
		} else if (!$gameStore) {
			const playerRankIndex = getRank($playerStore.score);
			playerRank = $LL.player.ranks[playerRankIndex]();

			step = Step.KNOWN_PLAYER;
			linesKnownPlayer = [
				{ id: step, text: $LL.headquarters.id.acmeSystems(), isTitle: true },
				{ text: $LL.headquarters.id.indentified({ name: $playerStore.name }) },
				{ text: $LL.headquarters.id.rank({ rank: playerRank.toLowerCase() }) }
			];
		} else if (step !== Step.ASSIGNMENT) {
			step = Step.NEWS_FLASH;
			linesNewsFlash = [
				{ id: step, text: $LL.headquarters.newsflash.title(), isTitle: true },
				{ text: $LL.headquarters.newsflash.content.line1({ city: $gameStore.rounds[0].atlas.city }) }, // prettier-ignore
				{ text: $LL.headquarters.newsflash.content.line2({ treasure: $gameStore.stolenTreasure }) }, // prettier-ignore
				{ text: $LL.headquarters.newsflash.content.line3({ sex: $gameStore.suspect.warrantKeys.sex }) } // prettier-ignore
			];
		} else {
			step = Step.ASSIGNMENT;
			linesAssignment = [
				{ id: step, text: $LL.headquarters.assignment.title(), isTitle: true },
				{ text: $LL.headquarters.assignment.content.line1({ city: $gameStore.rounds[0].atlas.city, sex: $gameStore.suspect.warrantKeys.sex }) }, // prettier-ignore
				{ text: $LL.headquarters.assignment.content.line2() },
				{ text: $LL.headquarters.assignment.content.line3({ rank: playerRank, name: $playerStore.name }) } // prettier-ignore
			];
		}
	}

	$: isKnownPlayer = [Step.KNOWN_PLAYER, Step.NEWS_FLASH, Step.ASSIGNMENT].includes(step);
	$: showNewsFlash = [Step.NEWS_FLASH, Step.ASSIGNMENT].includes(step);
	$: showAssignment = step === Step.ASSIGNMENT;
</script>

<Main>
	<Header slot="header">
		<H1>{$LL.headquarters.title()}</H1>
		<Time />
	</Header>

	<Artwork src="/artwork/headquarters.png" />

	<Footer slot="footer">
		{#if !isLoading}
			<TerminalGroup>
				{#if !isKnownPlayer}
					<TerminalRows lines={linesUnknownPlayer} bind:isAnimating />

					<TerminalForm>
						<TerminalTitle>
							{linesUnknownPlayerInput[0].text}
						</TerminalTitle>
						<TerminalFormInput
							placeholder={getRandomValue(['Olivia Starling', 'Rupert Westington'])}
							disabled={step !== Step.UNKNOWN_PLAYER}
							bind:value={playerName}
						/>
					</TerminalForm>
				{/if}

				{#if isKnownPlayer}
					<TerminalRows lines={linesKnownPlayer} bind:isAnimating />
				{/if}

				{#if showNewsFlash}
					<TerminalRows lines={linesNewsFlash} bind:isAnimating />
				{/if}

				{#if showAssignment}
					<TerminalRows lines={linesAssignment} bind:isAnimating />
				{/if}
			</TerminalGroup>
		{/if}

		<nav class="headquarters-nav">
			<ButtonIcon
				on:click={nextStep}
				title={$LL.components.buttons.continue()}
				disabled={isLoading || isAnimating}
			>
				<Continue />
			</ButtonIcon>
		</nav>
	</Footer>
</Main>

<style lang="scss">
	nav.headquarters-nav {
		display: flex;
		align-items: flex-end;
		gap: var(--layout-inline);
		margin-inline: var(--layout-inline);
		margin-left: auto;
	}
</style>
