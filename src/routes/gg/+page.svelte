<script lang="ts">
	import LL from '$i18n/i18n-svelte';
	import Artwork from '$lib/components/Artwork.svelte';
	import ButtonIcon from '$lib/components/ButtonIcon.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import H1 from '$lib/components/H1.svelte';
	import Header from '$lib/components/Header.svelte';
	import Main from '$lib/components/Main.svelte';
	import type { TerminalRow } from '$lib/components/Terminal';
	import TerminalGroup from '$lib/components/TerminalGroup.svelte';
	import TerminalRows from '$lib/components/TerminalRows.svelte';
	import Time from '$lib/components/Time.svelte';
	import TrailingSuspect from '$lib/components/TrailingSuspect.svelte';
	import { gameStore, getFormattedTime, type Atlas, SUSPECT_TRAIL_SCENE_DURATION } from '$lib/game';
	import { delay, redirectTo } from '$lib/helpers';
	import Continue from '$lib/icons/Continue.svg.svelte';
	import { getCasesUntilPromotion, getRank, playerStore, type Player } from '$lib/player';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	let isAnimating: boolean = false;
	let currentRoundAtlas: Atlas;
	let currentStepIndex: number;
	let maxStepIndex: number;

	let showDangerScene: boolean;
	let showCaptureScene: boolean;
	let hasOutroScenePlayed: boolean;

	let suspectCaught: boolean;
	let suspectCaughtWithWarrant: boolean;
	let suspectCaughtWithWrongWarrant: boolean;
	let suspectCaughtWithoutWarrant: boolean;

	let hasWarrant: boolean;
	let hasCorrectWarrant: boolean;

	let outcomeSuspectCaughtWithWarrant: TerminalRow[][] = [];
	let outcomeSuspectCaughtWithWrongWarrant: TerminalRow[][] = [];
	let outcomeSuspectCaughtWithoutWarrant: TerminalRow[][] = [];
	let outcomeSuspectGotAway: TerminalRow[][] = [];

	$: if ($playerStore && $gameStore && $LL) {
		const city = $gameStore.rounds[0].atlas.city;
		const suspect = $gameStore.suspect.name;
		const suspectWarrant = $LL.suspects[$gameStore.warrants[0]].name();

		const playerCases = getCasesUntilPromotion($playerStore.score);

		currentRoundAtlas = $gameStore.rounds[5].atlas;
		suspectCaught = $gameStore.suspect.caught;
		hasWarrant = $gameStore.warrants.length === 1;
		hasCorrectWarrant = hasWarrant && $gameStore.warrants[0] === $gameStore.suspect.key;

		outcomeSuspectCaughtWithWarrant = [
			[
				{ text: $LL.game.outcome.title(), isTitle: true },
				{ text: $LL.game.outcome.caughtWithWarrant[0]({ city, suspect }) },
				{ text: $LL.game.outcome.caughtWithWarrant[1]({ suspect, stolenTreasure: $gameStore.stolenTreasure, city }) } // prettier-ignore
			],
			[
				{ text: $LL.game.outcome.caughtWithWarrant[2]() },
				{ text: $LL.game.outcome.caughtWithWarrant[3]() },
				{ text: $LL.game.outcome.caughtWithWarrant[4]({ cases: playerCases }) }
			]
		];

		outcomeSuspectCaughtWithWrongWarrant = [
			[
				{ text: $LL.game.outcome.title(), isTitle: true },
				{ text: $LL.game.outcome.caughtWithWrongWarrant[0]({ suspect }) },
				{ text: $LL.game.outcome.caughtWithWrongWarrant[1]({ suspect: suspectWarrant }) }
			],
			[
				{ text: $LL.game.outcome.caughtWithWrongWarrant[2]() },
				{ text: $LL.game.outcome.caughtWithWrongWarrant[3]() }
			]
		];

		outcomeSuspectCaughtWithoutWarrant = [
			[
				{ text: $LL.game.outcome.title(), isTitle: true },
				{ text: $LL.game.outcome.caughtWithoutWarrant[0]({ suspect }) },
				{ text: $LL.game.outcome.caughtWithoutWarrant[1]() }
			],
			[{ text: $LL.game.outcome.caughtWithoutWarrant[2]() }]
		];

		outcomeSuspectGotAway = [
			[
				{ text: $LL.game.outcome.title(), isTitle: true },
				{ text: $LL.game.outcome.gotAway[0]() },
				{ text: $LL.game.outcome.gotAway[1]({ suspect }) }
			]
		];
	}

	$: suspectGotAway = !suspectCaught;
	$: suspectCaughtWithWarrant = suspectCaught && hasCorrectWarrant;
	$: suspectCaughtWithoutWarrant = suspectCaught && !hasWarrant;
	$: suspectCaughtWithWrongWarrant = suspectCaught && hasWarrant && !hasCorrectWarrant;

	$: {
		currentStepIndex = 0;
		maxStepIndex = suspectGotAway ? 0 : 1;
	}

	async function playOutroScene(): Promise<void> {
		showDangerScene = true;
		await delay(SUSPECT_TRAIL_SCENE_DURATION);

		showDangerScene = false;
		showCaptureScene = true;
		await delay(SUSPECT_TRAIL_SCENE_DURATION);

		showCaptureScene = false;
		hasOutroScenePlayed = true;
	}

	function nextStep(): void {
		if (currentStepIndex < maxStepIndex) {
			currentStepIndex += 1;
		} else {
			// No more steps, go to headquarters
			redirectTo('/headquarters/');

			// No points for you!
			if (!suspectCaughtWithWarrant) return;

			// Save score to player store
			playerStore.update((player: Player | null) => {
				player ? (player.score += 1) : null;
				return player;
			});
		}
	}

	onMount(() => {
		if ($playerStore === null || $gameStore === null) {
			redirectTo('/headquarters/');
			return new Error('No player or game store');
		} else if (!suspectGotAway) {
			playOutroScene();
		}
	});
</script>

{#if $gameStore}
	<Main>
		<Header slot="header">
			{#if suspectGotAway || hasOutroScenePlayed}
				<H1>{currentRoundAtlas.city}</H1>

				{#if $gameStore.currentTime && $playerStore}
					<Time
						isClockTicking={false}
						currentTime={getFormattedTime(new Date($gameStore.currentTime), $playerStore.locale)}
					/>
				{/if}
			{/if}
		</Header>

		{#if showDangerScene}
			<TrailingSuspect sceneIndex={'5'} sex={$gameStore.suspect.warrantKeys.sex} />
		{/if}

		{#if showCaptureScene}
			<TrailingSuspect sceneIndex={'6'} sex={$gameStore.suspect.warrantKeys.sex} />
		{/if}

		<Artwork isDisabled={true} src={currentRoundAtlas.artwork} />

		<Footer slot="footer">
			{#if !showDangerScene && !showCaptureScene}
				<TerminalGroup>
					{#if suspectGotAway}
						<TerminalRows lines={outcomeSuspectGotAway[0]} bind:isAnimating />
					{/if}

					{#if hasOutroScenePlayed}
						{#if suspectCaughtWithWarrant}
							<TerminalRows lines={outcomeSuspectCaughtWithWarrant[0]} />
							{#if currentStepIndex > 0}
								<TerminalRows lines={outcomeSuspectCaughtWithWarrant[1]} bind:isAnimating />
							{/if}
						{/if}

						{#if suspectCaughtWithWrongWarrant}
							<TerminalRows lines={outcomeSuspectCaughtWithWrongWarrant[0]} />
							{#if currentStepIndex > 0}
								<TerminalRows lines={outcomeSuspectCaughtWithWrongWarrant[1]} bind:isAnimating />
							{/if}
						{/if}

						{#if suspectCaughtWithoutWarrant}
							<TerminalRows lines={outcomeSuspectCaughtWithoutWarrant[0]} />
							{#if currentStepIndex > 0}
								<TerminalRows lines={outcomeSuspectCaughtWithoutWarrant[1]} bind:isAnimating />
							{/if}
						{/if}
					{/if}

					{#if $playerStore && currentStepIndex == maxStepIndex}
						{@const playerRankIndex = getRank($playerStore.score)}
						<TerminalRows
							lines={[
								{
									text: $LL.game.outcome.ready({
										name: $playerStore.name,
										rank: $LL.player.ranks[playerRankIndex]()
									})
								}
							]}
						/>
					{/if}
				</TerminalGroup>
			{/if}

			{#if suspectGotAway || hasOutroScenePlayed}
				<nav class="game-nav" transition:fade>
					<ButtonIcon
						on:click={nextStep}
						disabled={isAnimating}
						title={$LL.components.buttons.continue()}
					>
						<Continue />
					</ButtonIcon>
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
		margin-left: auto;
	}
</style>
