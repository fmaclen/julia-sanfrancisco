<script lang="ts">
	import LL from '$i18n/i18n-svelte';
	import type { Translation } from '$i18n/i18n-types';
	import ButtonIcon from '$lib/components/ButtonIcon.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import Main from '$lib/components/Main.svelte';
	import type { TerminalRow } from '$lib/components/Terminal';
	import TerminalGroup from '$lib/components/TerminalGroup.svelte';
	import TerminalRows from '$lib/components/TerminalRows.svelte';
	import TrailingSuspect from '$lib/components/TrailingSuspect.svelte';
	import { gameStore } from '$lib/game';
	import { delay, redirectTo } from '$lib/helpers';
	import Continue from '$lib/icons/Continue.svg.svelte';
	import { getCasesUntilPromotion, getRank, playerStore, type Player } from '$lib/player';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	let sceneIndex: keyof Translation['game']['trailingSuspect'];
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
		const playerName = $playerStore.name;
		const playerRankIndex = getRank($playerStore.score);
		const playerRank = $LL.player.ranks[playerRankIndex]();

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
			],
			[{ text: $LL.game.outcome.ready({ rank: playerRank, name: playerName }) }]
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
			],
			[{ text: $LL.game.outcome.ready({ rank: playerRank, name: playerName }) }]
		];

		outcomeSuspectCaughtWithoutWarrant = [
			[
				{ text: $LL.game.outcome.title(), isTitle: true },
				{ text: $LL.game.outcome.caughtWithoutWarrant[0]({ suspect }) },
				{ text: $LL.game.outcome.caughtWithoutWarrant[1]() }
			],
			[{ text: $LL.game.outcome.caughtWithoutWarrant[2]() }],
			[{ text: $LL.game.outcome.ready({ rank: playerRank, name: playerName }) }]
		];

		outcomeSuspectGotAway = [
			[
				{ text: $LL.game.outcome.title(), isTitle: true },
				{ text: $LL.game.outcome.gotAway[0]() },
				{ text: $LL.game.outcome.gotAway[1]({ suspect }) }
			],
			[{ text: $LL.game.outcome.ready({ rank: playerRank, name: playerName }) }]
		];
	}

	$: suspectGotAway = !suspectCaught;
	$: suspectCaughtWithWarrant = suspectCaught && hasCorrectWarrant;
	$: suspectCaughtWithWrongWarrant = suspectCaught && hasWarrant && !hasCorrectWarrant;
	$: suspectCaughtWithoutWarrant = suspectCaught && !hasWarrant;

	async function playOutroScene(): Promise<void> {
		showDangerScene = true;
		await delay(4000);

		showDangerScene = false;
		showCaptureScene = true;
		await delay(4000);

		showCaptureScene = false;
		hasOutroScenePlayed = true;
	}

	function updateScore(): void {
		redirectTo('/headquarters/');

		if (!suspectCaughtWithWarrant) return; // No points for you!

		playerStore.update((player: Player | null) => {
			player ? (player.score += 1) : null;
			return player;
		});
	}

	onMount(() => {
		if ($playerStore === null || $gameStore === null) {
			redirectTo('/headquarters/');
			return new Error('No player or game store');
		} else {
			playOutroScene();
		}
	});
</script>

<Main>
	{#if $gameStore}
		{#if showDangerScene}
			<TrailingSuspect sceneIndex={'5'} sex={$gameStore.suspect.warrantKeys.sex} />
		{/if}

		{#if showCaptureScene}
			<TrailingSuspect sceneIndex={'6'} sex={$gameStore.suspect.warrantKeys.sex} />
		{/if}

		{#if hasOutroScenePlayed}
			{#if suspectCaughtWithWarrant}
				<TerminalGroup>
					<TerminalRows lines={outcomeSuspectCaughtWithWarrant[0]} />
					<TerminalRows lines={outcomeSuspectCaughtWithWarrant[1]} />
					<TerminalRows lines={outcomeSuspectCaughtWithWarrant[2]} />
					<TerminalRows lines={outcomeSuspectCaughtWithWarrant[3]} />
				</TerminalGroup>
			{/if}

			{#if suspectCaughtWithWrongWarrant}
				<TerminalGroup>
					<TerminalRows lines={outcomeSuspectCaughtWithWrongWarrant[0]} />
					<TerminalRows lines={outcomeSuspectCaughtWithWrongWarrant[1]} />
					<TerminalRows lines={outcomeSuspectCaughtWithWrongWarrant[2]} />
				</TerminalGroup>
			{/if}

			{#if suspectCaughtWithoutWarrant}
				<TerminalGroup>
					<TerminalRows lines={outcomeSuspectCaughtWithoutWarrant[0]} />
					<TerminalRows lines={outcomeSuspectCaughtWithoutWarrant[1]} />
					<TerminalRows lines={outcomeSuspectCaughtWithoutWarrant[2]} />
				</TerminalGroup>
			{/if}

			{#if suspectGotAway}
				<TerminalGroup>
					<TerminalRows lines={outcomeSuspectGotAway[0]} />
					<TerminalRows lines={outcomeSuspectGotAway[1]} />
					<TerminalRows lines={outcomeSuspectGotAway[2]} />
				</TerminalGroup>
			{/if}

			<Footer slot="footer">
				<nav class="game-nav" transition:fade>
					<ButtonIcon on:click={updateScore} title={$LL.components.buttons.continue()}>
						<Continue />
					</ButtonIcon>
				</nav>
			</Footer>
		{/if}
	{/if}
</Main>
