<script lang="ts">
	import LL, { locale } from '$i18n/i18n-svelte';
	import Artwork from '$lib/components/Artwork.svelte';
	import Button from '$lib/components/Button.svelte';
	import ButtonLink from '$lib/components/ButtonLink.svelte';
	import H1 from '$lib/components/H1.svelte';
	import Header from '$lib/components/Header.svelte';
	import MainGrid from '$lib/components/MainGrid.svelte';
	import Nav from '$lib/components/Nav.svelte';
	import P from '$lib/components/P.svelte';
	import Section from '$lib/components/Section.svelte';
	import type { TerminalLine } from '$lib/components/Terminal';
	import Terminal from '$lib/components/Terminal.svelte';
	import Time from '$lib/components/Time.svelte';
	import { gameStore, generateGame } from '$lib/game';
	import { getRank } from '$lib/player';
	import { playerStore } from '$lib/player';
	import ButtonIcon from '../../lib/components/ButtonIcon.svelte';
	import GroupFade from '../../lib/components/GroupFade.svelte';
	import { redirectTo } from '../../lib/helpers';
	import Continue from '../../lib/icons/Continue.svg.svelte';
	import { onMount } from 'svelte';

	enum Step {
		unknownPlayer,
		knownPlayer,
		newsFlash,
		assignment
	}

	let isLoading = true;
	let step: Step;
	let playerName: string;
	let playerRank: string;

	function setPlayer() {
		playerStore.set({ name: playerName, score: 0, locale: $locale });
	}

	function nextStep() {
		// isLoading = true;

		switch (step) {
			case Step.unknownPlayer:
				setPlayer();
				return;

			case Step.knownPlayer:
				if (!$gameStore) {
					const newGame = generateGame($LL);
					gameStore.set(newGame);
				}
				step = Step.newsFlash;
				return;

			case Step.newsFlash:
				step = Step.assignment;
				return;

			case Step.assignment:
				redirectTo('/game');
				return;
		}
	}

	// let sessionLines: TerminalLine[][] = [];

	let linesUnknownPlayer: TerminalLine[] = [];
	let linesKnownPlayer: TerminalLine[] = [];
	let linesNewsFlash: TerminalLine[] = [];
	let linesAssignment: TerminalLine[] = [];

	onMount(() => {
		// sessionLines = [];
		isLoading = false;
	});

	$: {
		console.log('step', step);
		if ($playerStore) {
			// Get the player's rank
			const playerRankIndex = getRank($playerStore.score);
			playerRank = $LL.player.ranks[playerRankIndex]();

			// Add player name and rank to the screen
			linesKnownPlayer = [
				{ text: $LL.headquarters.id.acmeSystems(), type: 'title' },
				{ text: $LL.headquarters.id.indentified({ name: $playerStore.name }) },
				{ text: $LL.headquarters.id.rank({ rank: playerRank.toLowerCase() }) }
			];

			step = Step.knownPlayer;

			// Overwrite existing sessionLines
			// sessionLines = [linesKnownPlayer];

			if ($gameStore) {
				// Newsflash
				linesNewsFlash = [
					{ text: $LL.headquarters.newsflash.title(), type: 'title' },
					{
						text: $LL.headquarters.newsflash.content.line1({
							city: $gameStore.rounds[0].atlas.city
						})
					},
					{
						text: $LL.headquarters.newsflash.content.line2({
							treasure: $gameStore.stolenTreasure
						})
					},
					{
						text: $LL.headquarters.newsflash.content.line3({
							sex: $gameStore.suspect.sex.toLowerCase() as 'male' | 'female'
						})
					}
				];

				// Your assingment
				linesAssignment = [
					{ text: $LL.headquarters.assignment.title(), type: 'title' },
					{
						text: $LL.headquarters.assignment.content.line1({
							city: $gameStore.rounds[0].atlas.city,
							sex: $gameStore.suspect.sex.toLowerCase()
						})
					},
					{ text: $LL.headquarters.assignment.content.line2() },
					{
						text: $LL.headquarters.assignment.content.line3({
							rank: playerRank,
							name: $playerStore.name
						})
					}
				];

				// step = Step.newsFlash;
			}
		}

		if (!$playerStore) {
			step = Step.unknownPlayer;

			// No player found, so ask for the player's name
			linesUnknownPlayer = [
				{ text: $LL.headquarters.id.acmeSystems(), type: 'title' },
				{ text: $LL.headquarters.id.pending() },
				{ type: 'line-break' },
				{ text: $LL.headquarters.id.yourName(), type: 'title' }
			];

			// sessionLines.push(linesUnknownPlayer);
		}

		// console.log(step);
	}

	// $: if (!$playerStore) {

	// }

	// $: if ($playerStore) {
	// 	const playerRankIndex = getRank($playerStore.score);
	// 	playerRank = $LL.player.ranks[playerRankIndex]();

	// 	sessionLines = [
	// 		{ text: $LL.headquarters.id.acmeSystems(), type: 'title' },
	// 		{ text: $LL.headquarters.id.indentified({ name: $playerStore.name }) },
	// 		{ text: $LL.headquarters.id.rank({ rank: playerRank.toLowerCase() }) }
	// 	];
	// }

	// $: if ($playerStore && $gameStore) {
	// 	linesNewsFlash = [
	// 		{ text: $LL.headquarters.newsflash.title(), type: 'title' },
	// 		{ text: $LL.headquarters.newsflash.content.line1({ city: $gameStore.rounds[0].atlas.city }) },
	// 		{ text: $LL.headquarters.newsflash.content.line2({ treasure: $gameStore.stolenTreasure }) },
	// 		{
	// 			text: $LL.headquarters.newsflash.content.line3({
	// 				sex: $gameStore.suspect.sex.toLowerCase() as 'male' | 'female'
	// 			})
	// 		}
	// 	];

	// 	linesAssignment = [
	// 		{ type: 'line-break' },
	// { text: $LL.headquarters.assignment.title(), type: 'title' },
	// {
	// 	text: $LL.headquarters.assignment.content.line1({
	// 		city: $gameStore.rounds[0].atlas.city,
	// 		sex: $gameStore.suspect.sex.toLowerCase()
	// 	})
	// },
	// { text: $LL.headquarters.assignment.content.line2() },
	// {
	// 	text: $LL.headquarters.assignment.content.line3({
	// 		rank: playerRank,
	// 		name: $playerStore.name
	// 	})
	// }
	// 	];
	// }
</script>

{#if !isLoading}
	<!-- <GroupFade> -->
	<MainGrid>
		<Header slot="header">
			<H1>{$LL.headquarters.title()}</H1>
			<Time />
		</Header>

		<Artwork src="/artwork/headquarters.png" />

		<footer class="footer" slot="footer">
			<!-- {#each sessionLines as session}
					{#if session.length > 0}
						<Terminal lines={session}>
							{#if !$playerStore}
								<input
									class="input"
									type="text"
									name="name"
									placeholder="Sleazy McSleazebag"
									bind:value={playerName}
								/>
							{/if}
						</Terminal>
					{/if}
				{/each} -->

			<!-- {#if sessionLines.length > 0}
					<Terminal lines={sessionLines}>
						{#if !$playerStore}
							<input
								class="input"
								type="text"
								name="name"
								placeholder="Sleazy McSleazebag"
								bind:value={playerName}
							/>
						{/if}
					</Terminal>
				{/if} -->
			<section class="terminal-group">
				{#if linesUnknownPlayer.length > 0}
					<Terminal lines={linesUnknownPlayer}>
						<input
							class="input"
							type="text"
							name="name"
							placeholder="Sleazy McSleazebag"
							bind:value={playerName}
						/>
					</Terminal>
				{/if}

				{#if linesKnownPlayer.length > 0}
					<Terminal lines={linesKnownPlayer} />
				{/if}

				{#if $gameStore && step !== Step.knownPlayer}
					<Terminal lines={linesNewsFlash} />
				{/if}

				{#if linesAssignment.length > 0 && step === Step.assignment}
					<Terminal lines={linesAssignment} />
				{/if}
			</section>

			<ButtonIcon on:click={nextStep} title={$LL.components.buttons.continue()} disabled={false}>
				<Continue />
			</ButtonIcon>
		</footer>
	</MainGrid>
	<!-- </GroupFade> -->
{/if}

<style lang="scss">
	@import '$lib/components/mixins.scss';

	footer.footer {
		display: flex;
		flex-direction: column;
		gap: var(--layout-block);
		margin-bottom: var(--layout-block);
	}

	section.terminal-group {
		@import '$lib/components/mixins.scss';

		@include plate;
		margin-inline: var(--layout-inline);
		padding-inline: unset;
		/* background-color: rgb(255, 99, 71, 0.5); */
		max-height: 40dvh;
		overflow-y: auto;
	}

	input.input {
		width: 100%;
		box-sizing: border-box;
		background: transparent;
		border: unset;
		outline: none;
		font-size: 16px;
		font-family: var(--font-family-mono);
		color: var(--color-neutral-100);
		padding: unset;
		/* padding-inline: 16px; */
		/* margin-block: 16px; */

		&::placeholder {
			color: var(--color-neutral-500);
		}
	}
</style>
