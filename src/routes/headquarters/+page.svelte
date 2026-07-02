<script lang="ts">
	import LL, { locale } from '$i18n/i18n-svelte';
	import Artwork from '$lib/components/Artwork.svelte';
	import ButtonIcon from '$lib/components/ButtonIcon.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import H1 from '$lib/components/H1.svelte';
	import Header from '$lib/components/Header.svelte';
	import Main from '$lib/components/Main.svelte';
	import TerminalForm from '$lib/components/TerminalForm.svelte';
	import TerminalFormInput from '$lib/components/TerminalFormInput.svelte';
	import TerminalGroup from '$lib/components/TerminalGroup.svelte';
	import TerminalRows from '$lib/components/TerminalRows.svelte';
	import TerminalTitle from '$lib/components/TerminalTitle.svelte';
	import Time from '$lib/components/Time.svelte';
	import type { TerminalRow } from '$lib/components/Terminal';
	import { gameStore, generateGame } from '$lib/game';
	import { getRandomValue, redirectTo } from '$lib/helpers';
	import Continue from '$lib/icons/Continue.svg.svelte';
	import { getRank } from '$lib/player';
	import { playerStore } from '$lib/player';

	// Headquarters always starts a new game
	gameStore.set(null);

	enum Step {
		UNKNOWN_PLAYER,
		KNOWN_PLAYER,
		NEWS_FLASH,
		ASSIGNMENT
	}

	let isMounted = $derived(false);
	let isAnimating = $state(false);
	let step: Step = $state($playerStore ? Step.KNOWN_PLAYER : Step.UNKNOWN_PLAYER);
	let playerName: string = $state('');
	let playerRank: string = $derived(
		$playerStore ? $LL.player.ranks[getRank($playerStore.score)]() : ''
	);

	function setPlayer() {
		playerStore.set({ name: playerName, score: 0, locale: $locale });
		step = Step.KNOWN_PLAYER;
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

	$effect(() => {
		isMounted = true;
	});

	let linesUnknownPlayer: TerminalRow[] = $derived.by(() => [
		{ id: Step.UNKNOWN_PLAYER, text: $LL.headquarters.id.acmeSystems(), isTitle: true },
		{ text: $LL.headquarters.id.pending() }
	]);
	let linesUnknownPlayerInput: TerminalRow[] = $derived.by(() => [
		{ text: $LL.headquarters.id.yourName(), isTitle: true }
	]);
	let linesKnownPlayer: TerminalRow[] = $derived.by(() => {
		if (!$playerStore) return [];

		return [
			{ id: Step.KNOWN_PLAYER, text: $LL.headquarters.id.acmeSystems(), isTitle: true },
			{ text: $LL.headquarters.id.indentified({ name: $playerStore.name }) },
			{ text: $LL.headquarters.id.rank({ rank: playerRank.toLowerCase() }) }
		];
	});
	let linesNewsFlash: TerminalRow[] = $derived.by(() => {
		if (!$gameStore) return [];

		return [
			{ id: Step.NEWS_FLASH, text: $LL.headquarters.newsflash.title(), isTitle: true },
			{ text: $LL.headquarters.newsflash.lines[0]({ city: $gameStore.rounds[0].atlas.city }) }, // prettier-ignore
			{ text: $LL.headquarters.newsflash.lines[1]({ treasure: $gameStore.stolenTreasure }) }, // prettier-ignore
			{ text: $LL.headquarters.newsflash.lines[2]({ sex: $gameStore.suspect.warrantKeys.sex }) } // prettier-ignore
		];
	});
	let linesAssignment: TerminalRow[] = $derived.by(() => {
		if (!$playerStore || !$gameStore) return [];

		return [
			{ id: Step.ASSIGNMENT, text: $LL.headquarters.assignment.title(), isTitle: true },
			{ text: $LL.headquarters.assignment.lines[0]({ city: $gameStore.rounds[0].atlas.city, sex: $gameStore.suspect.warrantKeys.sex }) }, // prettier-ignore
			{ text: $LL.headquarters.assignment.lines[1]() },
			{ text: $LL.headquarters.assignment.lines[2]({ rank: playerRank, name: $playerStore.name }) } // prettier-ignore
		];
	});

	let isKnownPlayer = $derived(
		[Step.KNOWN_PLAYER, Step.NEWS_FLASH, Step.ASSIGNMENT].includes(step)
	);
	let showNewsFlash = $derived([Step.NEWS_FLASH, Step.ASSIGNMENT].includes(step));
	let showAssignment = $derived([Step.ASSIGNMENT].includes(step));
</script>

<Main>
	{#snippet header()}
		<Header>
			<H1>{$LL.headquarters.title()}</H1>
			<Time />
		</Header>
	{/snippet}

	<Artwork src="/artwork/headquarters.png" />

	{#snippet footer()}
		<Footer>
			{#if isMounted}
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
						<TerminalRows lines={linesNewsFlash} bind:isAnimating shouldAutoScroll={true} />
					{/if}

					{#if showAssignment}
						<TerminalRows lines={linesAssignment} bind:isAnimating shouldAutoScroll={true} />
					{/if}
				</TerminalGroup>
			{/if}

			<nav class="headquarters-nav">
				<ButtonIcon
					onclick={nextStep}
					title={$LL.components.buttons.continue()}
					disabled={!isMounted || isAnimating}
				>
					<Continue />
				</ButtonIcon>
			</nav>
		</Footer>
	{/snippet}
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
