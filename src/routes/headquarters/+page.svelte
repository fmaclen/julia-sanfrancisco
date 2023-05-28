<script lang="ts">
	import LL, { locale } from '$i18n/i18n-svelte';
	import Artwork from '$lib/components/Artwork.svelte';
	import H1 from '$lib/components/H1.svelte';
	import Header from '$lib/components/Header.svelte';
	import MainGrid from '$lib/components/MainGrid.svelte';
	import type { TerminalLine } from '$lib/components/Terminal';
	import Terminal from '$lib/components/Terminal.svelte';
	import Time from '$lib/components/Time.svelte';
	import { gameStore, generateGame } from '$lib/game';
	import { getRank } from '$lib/player';
	import { playerStore } from '$lib/player';
	import ButtonIcon from '../../lib/components/ButtonIcon.svelte';
	import TerminalGroup from '../../lib/components/TerminalGroup.svelte';
	import { redirectTo } from '../../lib/helpers';
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

	let sessionLines: TerminalLine[][] = [];
	let linesUnknownPlayer: TerminalLine[] = [];
	let linesUnknownPlayerInput: TerminalLine[] = [];
	let linesKnownPlayer: TerminalLine[] = [];
	let linesNewsFlash: TerminalLine[] = [];
	let linesAssignment: TerminalLine[] = [];

	if ($playerStore && $gameStore) {
		step = Step.KNOWN_PLAYER;
	}

	$: {
		if (!$playerStore) {
			linesUnknownPlayer = [
				{ id: Step.UNKNOWN_PLAYER, text: $LL.headquarters.id.acmeSystems(), type: 'title' },
				{ text: $LL.headquarters.id.pending() }
			];

			linesUnknownPlayerInput = [{ text: $LL.headquarters.id.yourName(), type: 'title' }];

			step = Step.UNKNOWN_PLAYER;
		} else if (!$gameStore) {
			const playerRankIndex = getRank($playerStore.score);
			playerRank = $LL.player.ranks[playerRankIndex]();

			linesKnownPlayer = [
				{ id: Step.KNOWN_PLAYER, text: $LL.headquarters.id.acmeSystems(), type: 'title' },
				{ text: $LL.headquarters.id.indentified({ name: $playerStore.name }) },
				{ text: $LL.headquarters.id.rank({ rank: playerRank.toLowerCase() }) }
			];

			step = Step.KNOWN_PLAYER;
		} else if (step !== Step.ASSIGNMENT) {
			linesNewsFlash = [
				{ id: Step.NEWS_FLASH, text: $LL.headquarters.newsflash.title(), type: 'title' },
				{ text: $LL.headquarters.newsflash.content.line1({ city: $gameStore.rounds[0].atlas.city }) }, // prettier-ignore
				{ text: $LL.headquarters.newsflash.content.line2({ treasure: $gameStore.stolenTreasure }) }, // prettier-ignore
				{ text: $LL.headquarters.newsflash.content.line3({ sex: $gameStore.suspect.sex.toLowerCase() as 'male' | 'female' }) } // prettier-ignore
			];
			step = Step.NEWS_FLASH;
		} else {
			linesAssignment = [
				{ id: Step.ASSIGNMENT, text: $LL.headquarters.assignment.title(), type: 'title' },
				{ text: $LL.headquarters.assignment.content.line1({ city: $gameStore.rounds[0].atlas.city, sex: $gameStore.suspect.sex.toLowerCase() }) }, // prettier-ignore
				{ text: $LL.headquarters.assignment.content.line2() },
				{ text: $LL.headquarters.assignment.content.line3({ rank: playerRank, name: $playerStore.name }) } // prettier-ignore
			];
			step = Step.ASSIGNMENT;
		}

		sessionLines = [
			linesUnknownPlayer,
			linesUnknownPlayerInput,
			linesKnownPlayer,
			linesNewsFlash,
			linesAssignment
		].filter(
			(lines) => lines.length > 0
		); // prettier-ignore
	}
</script>

<MainGrid>
	<Header slot="header">
		<H1>{$LL.headquarters.title()}</H1>
		<Time />
	</Header>

	<Artwork src="/artwork/headquarters.png" />

	<footer class="footer" slot="footer">
		{#if !isLoading}
			<TerminalGroup>
				{#each sessionLines as lines (lines[0].id)}
					<Terminal {lines}>
						{#if lines === linesUnknownPlayerInput}
							<li class="terminal__line">
								<input
									class="input"
									type="text"
									name="name"
									placeholder="Sleazy McSleazebag"
									disabled={step !== Step.UNKNOWN_PLAYER}
									bind:value={playerName}
								/>
							</li>
						{/if}
					</Terminal>
				{/each}
			</TerminalGroup>
		{/if}

		<nav class="headquarters-nav">
			<ButtonIcon on:click={nextStep} title={$LL.components.buttons.continue()} disabled={false}>
				<Continue />
			</ButtonIcon>
		</nav>
	</footer>
</MainGrid>

<style lang="scss">
	footer.footer {
		display: flex;
		flex-direction: column;
		gap: var(--layout-block);
		margin-bottom: var(--layout-block);
		align-items: flex-start;
	}

	nav.headquarters-nav {
		display: flex;
		align-items: flex-end;
		gap: var(--layout-inline);
		margin-inline: var(--layout-inline);
		margin-left: auto;
	}

	input.input {
		width: 100%;
		box-sizing: border-box;
		background: transparent;
		border: unset;
		outline: none;
		padding: unset;
		font-size: 16px;
		font-family: var(--font-family-mono);
		color: var(--color-green);

		&::placeholder {
			color: var(--color-neutral-500);
		}
	}
</style>
