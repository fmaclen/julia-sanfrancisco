<script lang="ts">
	import { redirectTo } from '$lib/helpers';
	import { getRank } from '$lib/player';
	import { playerStore } from '$lib/player';
	import Button from '../../lib/components/Button.svelte';
	import ButtonLink from '../../lib/components/ButtonLink.svelte';
	import H1 from '../../lib/components/H1.svelte';
	import Header from '../../lib/components/Header.svelte';
	import Main from '../../lib/components/Main.svelte';
	import Nav from '../../lib/components/Nav.svelte';
	import P from '../../lib/components/P.svelte';
	import Section from '../../lib/components/Section.svelte';

	let playerName: string;
	let rank = getRank($playerStore?.score);

	function setPlayer() {
		playerStore.set({ name: playerName, score: 0 });
	}
</script>

<Main>
	<Header>
		<H1>Headquarters</H1>
	</Header>

	{#if $playerStore}
		<Section>
			<P>You have been identified as <strong>{$playerStore.name}</strong>.</P>
			<P>Your current rank is <strong>{rank}</strong></P>
		</Section>
		<Nav>
			<ButtonLink href="/game/">Continue</ButtonLink>
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
