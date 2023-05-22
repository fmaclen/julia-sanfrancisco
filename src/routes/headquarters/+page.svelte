<script lang="ts">
	import LL, { locale } from '$i18n/i18n-svelte';
	import Button from '$lib/components/Button.svelte';
	import ButtonLink from '$lib/components/ButtonLink.svelte';
	import H1 from '$lib/components/H1.svelte';
	import Header from '$lib/components/Header.svelte';
	import Main from '$lib/components/Main.svelte';
	import Nav from '$lib/components/Nav.svelte';
	import P from '$lib/components/P.svelte';
	import Section from '$lib/components/Section.svelte';
	import type { TerminalLine } from '$lib/components/Terminal';
	import Terminal from '$lib/components/Terminal.svelte';
	import Time from '$lib/components/Time.svelte';
	import { gameStore, generateGame } from '$lib/game';
	import { getRank } from '$lib/player';
	import { playerStore } from '$lib/player';
	import { onMount } from 'svelte';

	let playerName: string;
	let playerRank: string = '';
	let isLoading: boolean = true;
	let playerLines: TerminalLine[] = [];
	let gameLines: TerminalLine[] | null = null;

	function setPlayer() {
		playerStore.set({ name: playerName, score: 0, locale: $locale });
	}

	function setGame() {
		const newGame = generateGame($LL);
		gameStore.set(newGame);
	}

	$: if ($playerStore) {
		const playerRankIndex = getRank($playerStore.score);
		playerRank = $LL.player.ranks[playerRankIndex]();

		playerLines = [
			{
				text: $LL.headquarters.id.indentified({ name: $playerStore.name })
			},
			{
				type: 'line-break'
			},
			{
				text: $LL.headquarters.id.rank({ rank: playerRank.toLowerCase() })
			}
		];
	}

	$: if ($playerStore && $gameStore) {
		const newsFlash: TerminalLine[] = [
			{
				text: `** ${$LL.headquarters.newsflash.title()} **`,
				type: 'title'
			},
			{
				text: $LL.headquarters.newsflash.content.line1({
					city: $gameStore.rounds[0].atlas.city
				})
			},
			{
				text: $LL.headquarters.newsflash.content.line2({ treasure: $gameStore.stolenTreasure })
			},
			{
				text: $LL.headquarters.newsflash.content.line3({ sex: $gameStore.suspect.sex })
			}
		];

		const assignment: TerminalLine[] = [
			{
				type: 'line-break'
			},
			{
				text: $LL.headquarters.assignment.title(),
				type: 'title'
			},
			{
				text: $LL.headquarters.assignment.content.line1({
					city: $gameStore.rounds[0].atlas.city,
					sex: $gameStore.suspect.sex.toLowerCase()
				})
			},
			{
				text: $LL.headquarters.assignment.content.line2()
			},
			{
				text: $LL.headquarters.assignment.content.line3({
					rank: playerRank,
					name: $playerStore.name
				})
			}
		];

		gameLines = [...newsFlash, ...assignment];
	}

	onMount(() => (isLoading = false));
</script>

<Main>
	<Header>
		<H1>{$LL.headquarters.title()}</H1>
		<Time />
	</Header>

	{#if isLoading}
		<Section>
			<P>{$LL.components.loading()}...</P>
		</Section>
	{:else if $playerStore}
		<Section>
			<Terminal lines={playerLines} />

			{#if gameLines}
				<Terminal lines={gameLines} />
			{/if}
		</Section>

		<Nav>
			{#if !$gameStore}
				<Button on:click={setGame}>{$LL.components.buttons.continue()}</Button>
			{:else}
				<ButtonLink href="/game/">{$LL.components.buttons.continue()}</ButtonLink>
			{/if}
		</Nav>
	{:else}
		<Section>
			<P>{$LL.headquarters.id.pending()}</P>
			<input
				class="input"
				type="text"
				name="name"
				placeholder="Your name"
				bind:value={playerName}
			/>
		</Section>
		<Nav>
			<Button on:click={setPlayer} disabled={!playerName}
				>{$LL.components.buttons.continue()}</Button
			>
		</Nav>
	{/if}
</Main>

<style lang="scss">
	@import '$lib/components/mixins.scss';

	input.input {
		width: 100%;
		box-sizing: border-box;
		background: transparent;
		font-size: 16px;
		padding: 16px;
		line-height: 150%;
		border: 1px solid var(--color-neutral-500);
		border-radius: var(--border-radius-m);
		color: var(--color-neutral-100);
	}
</style>
