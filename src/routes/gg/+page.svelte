<script lang="ts">
	import LL from '$i18n/i18n-svelte';
	import Artwork from '$lib/components/Artwork.svelte';
	import ButtonIcon from '$lib/components/ButtonIcon.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import H1 from '$lib/components/H1.svelte';
	import Header from '$lib/components/Header.svelte';
	import Main from '$lib/components/Main.svelte';
	import TerminalGroup from '$lib/components/TerminalGroup.svelte';
	import TerminalRows from '$lib/components/TerminalRows.svelte';
	import Time from '$lib/components/Time.svelte';
	import TrailingSuspect from '$lib/components/TrailingSuspect.svelte';
	import type { TerminalRow } from '$lib/components/Terminal';
	import { getFormattedTime, type Atlas, SUSPECT_TRAIL_SCENE_DURATION } from '$lib/game';
	import { delay, redirectTo } from '$lib/helpers';
	import Continue from '$lib/icons/Continue.svg.svelte';
	import { getCasesUntilPromotion, getRank } from '$lib/player';
	import { playSfx } from '$lib/sfx';
	import { playerState } from '$lib/state/player.svelte';
	import { sessionState } from '$lib/state/session.svelte';
	import { untrack } from 'svelte';
	import { fade } from 'svelte/transition';

	let isAnimating: boolean = $state(false);
	let currentRoundAtlas: Atlas = $derived.by(() =>
		sessionState.game ? sessionState.game.rounds[5].atlas : (null as unknown as Atlas)
	);
	let currentStepIndex: number = $state(0);

	let showDangerScene: boolean = $state(false);
	let showCaptureScene: boolean = $state(false);
	let hasOutroScenePlayed: boolean = $state(false);

	let suspectCaught: boolean = $derived(
		sessionState.game ? sessionState.game.suspect.caught : false
	);
	let suspectGotAway = $derived(!suspectCaught);

	let hasWarrant: boolean = $derived(
		sessionState.game ? sessionState.game.warrants.length === 1 : false
	);
	let hasCorrectWarrant: boolean = $derived(
		sessionState.game
			? hasWarrant && sessionState.game.warrants[0] === sessionState.game.suspect.key
			: false
	);
	let warrantSuspectName: string | undefined = $derived.by(() => {
		if (!sessionState.game || !$LL || sessionState.game.warrants.length === 0) return undefined;

		return $LL.suspects[sessionState.game.warrants[0]].name();
	});
	let suspectCaughtWithWarrant: boolean = $derived(suspectCaught && hasCorrectWarrant);
	let suspectCaughtWithWrongWarrant: boolean = $derived(
		suspectCaught && hasWarrant && !hasCorrectWarrant
	);
	let suspectCaughtWithoutWarrant: boolean = $derived(suspectCaught && !hasWarrant);
	let maxStepIndex: number = $derived(suspectGotAway ? 0 : 1);

	let outcomeSuspectCaughtWithWarrant: TerminalRow[][] = $derived.by(() => {
		if (!playerState.player || !sessionState.game || !$LL) return [];

		const city = sessionState.game.rounds[0].atlas.city;
		const suspect = sessionState.game.suspect.name;
		const playerCases = getCasesUntilPromotion(playerState.player.score);

		return [
			[
				{
					text: `${$LL.warrants.worldPolice()}: ${$LL.game.outcome.incomingMessage()}`,
					isTitle: true
				},
				{ text: $LL.game.outcome.caughtWithWarrant[0]({ city, suspect }) },
				{ text: $LL.game.outcome.caughtWithWarrant[1]({ suspect, stolenTreasure: sessionState.game.stolenTreasure, city }) } // prettier-ignore
			],
			[
				{ text: $LL.game.outcome.caughtWithWarrant[2]() },
				{ text: $LL.game.outcome.caughtWithWarrant[3]() },
				{ text: $LL.game.outcome.caughtWithWarrant[4]({ cases: playerCases }) }
			]
		];
	});
	let outcomeSuspectCaughtWithWrongWarrant: TerminalRow[][] = $derived.by(() => {
		if (!playerState.player || !sessionState.game || !$LL || !warrantSuspectName) return [];

		const suspect = sessionState.game.suspect.name;

		return [
			[
				{
					text: `${$LL.warrants.worldPolice()}: ${$LL.game.outcome.incomingMessage()}`,
					isTitle: true
				},
				{ text: $LL.game.outcome.caughtWithWrongWarrant[0]({ suspect }) },
				{ text: $LL.game.outcome.caughtWithWrongWarrant[1]({ suspect: warrantSuspectName }) }
			],
			[
				{ text: $LL.game.outcome.caughtWithWrongWarrant[2]() },
				{ text: $LL.game.outcome.caughtWithWrongWarrant[3]() }
			]
		];
	});
	let outcomeSuspectCaughtWithoutWarrant: TerminalRow[][] = $derived.by(() => {
		if (!sessionState.game || !$LL) return [];

		const suspect = sessionState.game.suspect.name;

		return [
			[
				{
					text: `${$LL.warrants.worldPolice()}: ${$LL.game.outcome.incomingMessage()}`,
					isTitle: true
				},
				{ text: $LL.game.outcome.caughtWithoutWarrant[0]({ suspect }) },
				{ text: $LL.game.outcome.caughtWithoutWarrant[1]() }
			],
			[{ text: $LL.game.outcome.caughtWithoutWarrant[2]() }]
		];
	});
	let outcomeSuspectGotAway: TerminalRow[][] = $derived.by(() => {
		if (!sessionState.game || !$LL) return [];

		const suspect = sessionState.game.suspect.name;

		return [
			[
				{
					text: `${$LL.warrants.worldPolice()}: ${$LL.game.outcome.incomingMessage()}`,
					isTitle: true
				},
				{ text: $LL.game.outcome.gotAway[0]() },
				{ text: $LL.game.outcome.gotAway[1]({ suspect }) }
			]
		];
	});

	async function playOutroScene(): Promise<void> {
		showDangerScene = true;
		playSfx('alert');
		await delay(SUSPECT_TRAIL_SCENE_DURATION);

		showDangerScene = false;
		showCaptureScene = true;
		playSfx('arrest');
		await delay(SUSPECT_TRAIL_SCENE_DURATION);

		showCaptureScene = false;
		hasOutroScenePlayed = true;
		playSfx(suspectCaughtWithWarrant ? 'victory' : 'gameover');
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
			if (playerState.player) {
				playerState.player.score += 1;
				playerState.save();
			}
		}
	}

	$effect(() => {
		untrack(() => {
			if (playerState.player === null || sessionState.game === null) {
				redirectTo('/headquarters/');
			} else if (!suspectGotAway) {
				void playOutroScene();
			} else {
				playSfx('gameover');
			}
		});
	});
</script>

{#if sessionState.game}
	{@const game = sessionState.game}
	<Main>
		{#snippet header()}
			<Header>
				{#if suspectGotAway || hasOutroScenePlayed}
					<H1>{currentRoundAtlas.city}</H1>

					{#if typeof game.elapsedMinutes === 'number' && playerState.player}
						{@const player = playerState.player}
						<Time
							isClockTicking={false}
							currentTime={getFormattedTime(game.elapsedMinutes, player.locale)}
						/>
					{/if}
				{/if}
			</Header>
		{/snippet}

		{#if showDangerScene}
			<TrailingSuspect sceneIndex="5" sex={game.suspect.warrantKeys.sex} />
		{/if}

		{#if showCaptureScene}
			<TrailingSuspect sceneIndex="6" sex={game.suspect.warrantKeys.sex} />
		{/if}

		<Artwork isDisabled={true} src={currentRoundAtlas.artwork} />

		{#snippet footer()}
			<Footer>
				{#if !showDangerScene && !showCaptureScene}
					<TerminalGroup>
						{#if suspectGotAway}
							<TerminalRows
								lines={outcomeSuspectGotAway[0]}
								shouldAutoScroll={true}
								bind:isAnimating
							/>
						{/if}

						{#if hasOutroScenePlayed}
							{#if suspectCaughtWithWarrant}
								<TerminalRows lines={outcomeSuspectCaughtWithWarrant[0]} shouldAutoScroll={true} />
								{#if currentStepIndex > 0}
									<TerminalRows
										lines={outcomeSuspectCaughtWithWarrant[1]}
										shouldAutoScroll={true}
										bind:isAnimating
									/>
								{/if}
							{/if}

							{#if suspectCaughtWithWrongWarrant}
								<TerminalRows
									lines={outcomeSuspectCaughtWithWrongWarrant[0]}
									shouldAutoScroll={true}
								/>
								{#if currentStepIndex > 0}
									<TerminalRows
										lines={outcomeSuspectCaughtWithWrongWarrant[1]}
										shouldAutoScroll={true}
										bind:isAnimating
									/>
								{/if}
							{/if}

							{#if suspectCaughtWithoutWarrant}
								<TerminalRows
									lines={outcomeSuspectCaughtWithoutWarrant[0]}
									shouldAutoScroll={true}
								/>
								{#if currentStepIndex > 0}
									<TerminalRows
										lines={outcomeSuspectCaughtWithoutWarrant[1]}
										shouldAutoScroll={true}
										bind:isAnimating
									/>
								{/if}
							{/if}
						{/if}

						{#if playerState.player && currentStepIndex == maxStepIndex && !isAnimating}
							{@const playerRankIndex = getRank(playerState.player.score)}
							<TerminalRows
								shouldAutoScroll={true}
								lines={[
									{
										text: $LL.game.outcome.ready({
											name: playerState.player.name,
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
							onclick={nextStep}
							disabled={isAnimating}
							title={$LL.components.buttons.continue()}
						>
							<Continue />
						</ButtonIcon>
					</nav>
				{/if}
			</Footer>
		{/snippet}
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
