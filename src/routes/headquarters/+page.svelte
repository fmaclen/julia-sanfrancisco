<script lang="ts">
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

	let playerName: string;
	let rank = getRank($playerStore?.score);

	function setPlayer() {
		playerStore.set({ name: playerName, score: 0 });
	}

	function setGame() {
		gameStore.set(generateGame());
	}
</script>

<Main>
	<Header>
		<H1>Headquarters</H1>
		<Time />
	</Header>

	{#if $playerStore}
		<Section>
			<P>
				You have been identified as <strong>{$playerStore.name}</strong>.<br />
				Your current rank is <strong>{rank}</strong>
			</P>

			{#if $gameStore}
				<P>
					<strong>Newsflash</strong>
					<br />
					National treasure stolen from <strong>{$gameStore.rounds[0].atlas.city}</strong>.
					<br /><br />
					The treasure has been identified as <strong>{$gameStore.stolenTreasure}</strong>.
					<br /><br />
					<strong>{$gameStore.suspect.sex}</strong> has been reported at the scene of the crime.
					<br />
				</P>
				<P>
					<strong>Your assignment</strong>
					<br />
					Track the thief from <strong>{$gameStore.rounds[0].atlas.city}</strong> to {$gameStore
						.suspect.pronouns.possessive} hideout and arrest {$gameStore.suspect.pronouns.object}.
					<br />
				</P>
			{/if}
		</Section>

		<Nav>
			{#if !$gameStore}
				<Button on:click={setGame}>Continue</Button>
			{:else}
				<ButtonLink href="/game/">Continue</ButtonLink>
			{/if}
		</Nav>
	{:else}
		<Section>
			<P>Detective at keyboard, please identify yourself</P>
			<input
				class="input"
				type="text"
				name="name"
				placeholder="Your name"
				bind:value={playerName}
			/>
		</Section>
		<Nav>
			<Button on:click={setPlayer} disabled={!playerName}>Continue</Button>
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
