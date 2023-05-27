<script lang="ts">
	import { PUBLIC_GAME_VERSION } from '$env/static/public';
	import LL, { locale } from '$i18n/i18n-svelte';
	import Artwork from '$lib/components/Artwork.svelte';
	import Button from '$lib/components/Button.svelte';
	import ButtonLink from '$lib/components/ButtonLink.svelte';
	import H1 from '$lib/components/H1.svelte';
	import H2 from '$lib/components/H2.svelte';
	import Header from '$lib/components/Header.svelte';
	import Main from '$lib/components/Main.svelte';
	import Nav from '$lib/components/Nav.svelte';
	import Section from '$lib/components/Section.svelte';
	import { applyLocale, playerStore } from '$lib/player';
	import MainGrid from '../lib/components/MainGrid.svelte';
	import { fade } from 'svelte/transition';

	// const anArtworks = ['/artwork/headquarters.png', '/artwork/splash.png'];
	// let arworkIndex = 0;

	// $: artworkPath = '/artwork/splash.png';
	// function toggleArtwork(): void {
	// 	arworkIndex = arworkIndex === 0 ? 1 : 0;
	// }
</script>

<MainGrid>
	<Header slot="header">
		<H1 hero={true}>{$LL.home.title()}</H1>
	</Header>

	<!-- {#each anArtworks as anArtwork, index}
		{#if index === arworkIndex}
			<Artwork src={anArtwork} />
		{/if}
	{/each} -->

	<Artwork src="/artwork/splash.png" />
	<!-- {#if artworkPath == '/artwork/splash.png'}
	{:else}
		<Artwork src="/artwork/headquarters.png" />
	{/if} -->

	<footer class="footer" slot="footer">
		<Section>
			<H2>
				{$LL.home.introduction()}
			</H2>
		</Section>

		<nav class="splash-nav">
			<div class="splash-nav__new-game">
				<ButtonLink href="/headquarters/">{$LL.home.newGame()}</ButtonLink>
				<Button
					compact={true}
					disabled={$locale === 'en'}
					on:click={() => applyLocale('en', playerStore)}>🇺🇸</Button
				>
				<Button
					compact={true}
					disabled={$locale === 'es'}
					on:click={() => applyLocale('es', playerStore)}>🇪🇸</Button
				>
			</div>

			<div class="splash-nav__about">
				<a class="version" href="https://github.com/fmaclen/julia-sanfrancisco/" target="_blank">
					About
				</a>
				<a
					class="version"
					href="https://github.com/fmaclen/julia-sanfrancisco/releases/"
					target="_blank"
				>
					v{PUBLIC_GAME_VERSION}
				</a>
				<a class="version" href="https://twitter.com/fmaclen/" target="_blank"> Twitter </a>
			</div>
		</nav>
	</footer>
</MainGrid>

<style lang="scss">
	footer.footer {
		display: flex;
		flex-direction: column;
		gap: var(--layout-block);
		margin-bottom: var(--layout-block);
	}

	nav.splash-nav {
		display: flex;
		flex-direction: column;
		gap: 32px;
	}

	div.splash-nav__new-game,
	div.splash-nav__about {
		display: flex;
		margin-inline: var(--layout-inline);
	}

	div.splash-nav__new-game {
		gap: 8px;
	}

	div.splash-nav__about {
		justify-content: space-between;
		gap: 32px;
	}

	a.version {
		font-size: 14px;
		font-family: var(--font-family-mono);
		color: var(--color-neutral-400);
		text-decoration: none;

		&:last-child {
			text-align: right;
		}

		&:hover {
			color: var(--color-neutral-200);
		}
	}
</style>
