<script lang="ts">
	import { PUBLIC_GOOGLE_ANALYTICS_ID } from '$env/static/public';
	import type { Locales } from '$i18n/i18n-types';
	import { playerStore, applyLocale } from '$lib/player';
	import { onMount } from 'svelte';
	import { detectLocale, navigatorDetector } from 'typesafe-i18n/detectors';

	onMount(() => {
		const locale: Locales =
			$playerStore?.locale ?? detectLocale('en', ['en', 'es'], navigatorDetector);
		applyLocale(locale, playerStore);
	});
</script>

<svelte:head>
	{#if PUBLIC_GOOGLE_ANALYTICS_ID}
		<script async src="https://www.googletagmanager.com/gtag/js?id={PUBLIC_GOOGLE_ANALYTICS_ID}">
		</script>
		{@html `<script>${`
			window.dataLayer = window.dataLayer || [];
			function gtag() {
				dataLayer.push(arguments);
			}
			gtag('js', new Date());
			gtag('config', '${PUBLIC_GOOGLE_ANALYTICS_ID}');
		`}</script>`}
	{/if}
</svelte:head>

<div class="layout">
	<slot />
</div>

<style lang="scss">
	:global(body) {
		--color-neutral-50: #ffffff;
		--color-neutral-100: #e3e8e6;
		--color-neutral-200: #a4b0ac;
		--color-neutral-300: #6d7471;
		--color-neutral-400: #4f5452;
		--color-neutral-500: #3b3f3e;
		--color-neutral-600: #2d2f2e;
		--color-neutral-700: #232424;
		--color-neutral-800: #1e1e1e;
		--color-neutral-900: #181818;
		--color-neutral-950: #141414;
		--color-neutral-1000: #0f0f0f;

		--border-radius-l: 8px;
		--border-radius-m: 6px;
		--border-radius-s: 4px;

		--spacing-l: 16px;
		--spacing-m: 8px;
		--spacing-s: 4px;

		font-family: 'Mona Sans';
		margin: unset;
		color: var(--color-neutral-100);
		background-color: var(--color-neutral-1000);

		display: flex;
		align-items: center;
		justify-content: center;
		width: 100dvw;
		height: 100dvh;

		@media (min-width: 512px) and (min-height: 1024px) {
			background-color: var(--color-neutral-950);
		}
	}

	div.layout {
		width: 100dvw;
		min-width: 320px;
		max-width: 512px;

		height: 100dvh;
		max-height: 1024px;

		@media (min-width: 512px) and (min-height: 1024px) {
			border-radius: var(--border-radius-l);
			overflow: hidden;
		}
	}
</style>
