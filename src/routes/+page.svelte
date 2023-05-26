<script lang="ts">
	import { PUBLIC_GAME_VERSION } from '$env/static/public';
	import LL, { locale } from '$i18n/i18n-svelte';
	import Artwork from '$lib/components/Artwork.svelte';
	import Button from '$lib/components/Button.svelte';
	import ButtonLink from '$lib/components/ButtonLink.svelte';
	import H1 from '$lib/components/H1.svelte';
	import Header from '$lib/components/Header.svelte';
	import Main from '$lib/components/Main.svelte';
	import Nav from '$lib/components/Nav.svelte';
	import P from '$lib/components/P.svelte';
	import Section from '$lib/components/Section.svelte';
	import { applyLocale, playerStore } from '$lib/player';
</script>

<Main>
	<Artwork src="/artwork/splash.png" />

	<Header>
		<H1>{$LL.home.title()}</H1>
	</Header>

	<Section align="bottom">
		<P>
			{$LL.home.introduction()}
		</P>
	</Section>

	<Nav>
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
		<ButtonLink href="/headquarters/">{$LL.home.newGame()}</ButtonLink>
	</Nav>

	<footer class="footer">
		<a class="version" href="https://github.com/fmaclen/julia-sanfrancisco/" target="_blank">
			<code>Source code</code>
		</a>
		<a
			class="version"
			href="https://github.com/fmaclen/julia-sanfrancisco/releases/"
			target="_blank"
		>
			<code>v{PUBLIC_GAME_VERSION}</code>
		</a>
	</footer>
</Main>

<style lang="scss">
	footer.footer {
		display: flex;
		justify-content: space-between;
		margin-inline: var(--spacing-xl);
		margin-bottom: var(--spacing-xl);

		@media (max-width: 512px) {
			margin-inline: var(--spacing-l);
		}
	}

	a.version {
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
