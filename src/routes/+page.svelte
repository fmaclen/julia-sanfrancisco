<script lang="ts">
	import { PUBLIC_VERSION } from '$env/static/public';
	import ButtonLink from '$lib/components/ButtonLink.svelte';
	import H1 from '$lib/components/H1.svelte';
	import Header from '$lib/components/Header.svelte';
	import Main from '$lib/components/Main.svelte';
	import Nav from '$lib/components/Nav.svelte';
	import P from '$lib/components/P.svelte';
	import Section from '$lib/components/Section.svelte';
</script>

<Main>
	<Header>
		<H1>Julia Sanfrancisco</H1>
	</Header>

	<Section>
		<P>
			Chase Julia and her accomplices across different countries, unraveling clues, solving puzzles,
			and expanding your geography knowledge in this exciting detective game.
		</P>
	</Section>

	<Nav>
		<ButtonLink href="/headquarters/">New game</ButtonLink>
	</Nav>

	<a class="version" href="https://github.com/fmaclen/julia-sanfrancisco/">
		<code>{PUBLIC_VERSION}</code>
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
