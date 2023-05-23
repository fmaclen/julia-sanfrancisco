<script lang="ts">
	import { PUBLIC_GAME_VERSION } from '$env/static/public';
	import LL, { locale } from '$i18n/i18n-svelte';
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
	<Header>
		<H1>{$LL.home.title()}</H1>
	</Header>

	<Section>
		<P>
			{$LL.home.introduction()}
		</P>
	</Section>

	<Nav>
		<Nav>
			<Button disabled={$locale === 'en'} on:click={() => applyLocale('en', playerStore)}>
				EN
			</Button>
			<Button disabled={$locale === 'es'} on:click={() => applyLocale('es', playerStore)}>
				ES
			</Button>
		</Nav>
		<ButtonLink href="/headquarters/">{$LL.home.newGame()}</ButtonLink>
	</Nav>

	<a class="version" href="https://github.com/fmaclen/julia-sanfrancisco/" target="_blank">
		<code>v{PUBLIC_GAME_VERSION}</code>
	</a>
</Main>

<style lang="scss">
	a.version {
		padding: var(--spacing-s);
		text-align: center;
		color: var(--color-neutral-400);
		text-decoration: none;

		&:hover {
			color: var(--color-neutral-200);
		}
	}
</style>
