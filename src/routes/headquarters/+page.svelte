<script lang="ts">
	import LL from '$i18n/i18n-svelte';
	import Button from '$lib/components/Button.svelte';
	import ButtonLink from '$lib/components/ButtonLink.svelte';
	import H1 from '$lib/components/H1.svelte';
	import Header from '$lib/components/Header.svelte';
	import Main from '$lib/components/Main.svelte';
	import Nav from '$lib/components/Nav.svelte';
	import P from '$lib/components/P.svelte';
	import Section from '$lib/components/Section.svelte';
	import Time from '$lib/components/Time.svelte';
	import { gameStore, generateGame } from '$lib/game';
	import { getRank } from '$lib/player';
	import { playerStore } from '$lib/player';
	import { SUSPECTS } from '../../lib/suspects';
	import { onMount } from 'svelte';

	let isLoading: boolean = true;
	let playerName: string;
	let rank = getRank($playerStore?.score);

	function setPlayer() {
		playerStore.set({ name: playerName, score: 0 });
	}

	function setGame() {
		gameStore.set(generateGame());
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
			{#if $gameStore}
				<P>
					<strong>{$LL.headquarters.newsflash.title()}</strong>
					<p>
						{$LL.headquarters.newsflash.content.line1({ city: $gameStore.rounds[0].atlas.city })}
					</p>
					<p>{$LL.headquarters.newsflash.content.line2({ treasure: $gameStore.stolenTreasure })}</p>
					<p>{$LL.headquarters.newsflash.content.line3({ sex: $gameStore.suspect.sex })}</p>
				</P>
				<P>
					<strong>{$LL.headquarters.assignment.title()}</strong>
					<p>
						{$LL.headquarters.assignment.content.line1({
							city: $gameStore.rounds[0].atlas.city,
							pronounPossessive: $gameStore.suspect.pronouns.possessive,
							pronounObject: $gameStore.suspect.pronouns.object
						})}
					</p>
					<p>
						{$LL.headquarters.assignment.content.line2()}
					</p>
					<p>
						{$LL.headquarters.assignment.content.line3({
							rank: rank.toLowerCase(),
							name: $playerStore.name
						})}
					</p>
				</P>
			{:else}
				<P>
					<p>{$LL.headquarters.id.indentified({ name: $playerStore.name })}</p>
					<p>{$LL.headquarters.id.rank({ rank })}</p>
				</P>
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
