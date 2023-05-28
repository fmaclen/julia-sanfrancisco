<script lang="ts">
	import { PUBLIC_GAME_VERSION } from '$env/static/public';
	import LL, { locale } from '$i18n/i18n-svelte';
	import Artwork from '$lib/components/Artwork.svelte';
	import Button from '$lib/components/Button.svelte';
	import ButtonLink from '$lib/components/ButtonLink.svelte';
	import H1 from '$lib/components/H1.svelte';
	import H2 from '$lib/components/H2.svelte';
	import Header from '$lib/components/Header.svelte';
	import Section from '$lib/components/Section.svelte';
	import { applyLocale, playerStore } from '$lib/player';
	import MainGrid from '../lib/components/MainGrid.svelte';
	import { onMount } from 'svelte';

	let isLoading = true;

	onMount(() => {
		isLoading = false;
	});
</script>

<MainGrid>
	<Header slot="header">
		<H1 hero={true}>{$LL.splash.title()}</H1>
	</Header>

	<Artwork src="/artwork/splash.png" />

	<footer class="footer" slot="footer">
		{#if !isLoading}
			<Section>
				<H2>
					{$LL.splash.introduction()}
				</H2>
			</Section>

			<nav class="splash-nav">
				<div class="splash-nav__new-game">
					<ButtonLink href="/headquarters/">{$LL.splash.newGame()}</ButtonLink>
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
					<a class="metadata" target="_blank" href="https://github.com/fmaclen/julia-sanfrancisco/">
						{$LL.splash.about()}
					</a>
					<a
						class="metadata"
						target="_blank"
						href="https://github.com/fmaclen/julia-sanfrancisco/releases/"
					>
						v{PUBLIC_GAME_VERSION}
					</a>
					<a class="metadata" target="_blank" href="https://twitter.com/fmaclen/">Twitter</a>
				</div>
			</nav>
		{/if}
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

	a.metadata {
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
