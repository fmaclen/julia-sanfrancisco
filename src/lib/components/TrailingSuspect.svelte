<script lang="ts">
	import LL from '../../i18n/i18n-svelte';
	import type { Translation } from '../../i18n/i18n-types';
	import H1 from '$lib/components/H1.svelte';
	import SuspectFingerprint from '$lib/icons/SuspectFingerprint.svg.svelte';
	import SuspectHacker from '$lib/icons/SuspectHacker.svg.svelte';
	import SuspectKick from '$lib/icons/SuspectKick.svg.svelte';
	import SuspectPolice from '$lib/icons/SuspectPolice.svg.svelte';
	import SuspectRappel from '$lib/icons/SuspectRappel.svg.svelte';
	import SuspectRun from '$lib/icons/SuspectRun.svg.svelte';
	import SuspectSki from '$lib/icons/SuspectSki.svg.svelte';
	import type { WarrantSex } from '$lib/suspects';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	export let sex: WarrantSex;
	export let sceneIndex: keyof Translation['game']['trailingSuspect'];

	let isLoading: boolean = true;

	onMount(() => {
		isLoading = false;
	});
</script>

{#if !isLoading}
	<main
		class="
			trailing-suspect
			{sceneIndex === '5' ? 'trailing-suspect--danger' : ''}
			{sceneIndex === '6' ? 'trailing-suspect--capture' : ''}
		"
		transition:fade
	>
		{#if sceneIndex === '0'}
			<div class="trailing-suspect__icons">
				<SuspectRappel />
				<SuspectRappel />
				<SuspectRappel />
			</div>

			<span class="trailing-suspect__suspect">
				<H1>{$LL.game.trailingSuspect[0]({ sex })}</H1>
			</span>
			<H1>{$LL.game.trailingSuspect[1]()}</H1>
		{/if}

		{#if sceneIndex === '1'}
			<div class="trailing-suspect__icons">
				<SuspectFingerprint />
				<SuspectFingerprint />
				<SuspectFingerprint />
			</div>
			<H1>{$LL.game.trailingSuspect[2]()}</H1>
		{/if}

		{#if sceneIndex === '2'}
			<div class="trailing-suspect__icons">
				<SuspectHacker />
				<SuspectHacker />
				<SuspectHacker />
			</div>
			<H1>{$LL.game.trailingSuspect[3]()}</H1>
		{/if}

		{#if sceneIndex === '3'}
			<div class="trailing-suspect__icons">
				<SuspectSki />
				<SuspectSki />
				<SuspectSki />
			</div>
			<H1>{$LL.game.trailingSuspect[4]({ sex })}</H1>
		{/if}

		{#if sceneIndex === '4'}
			<div class="trailing-suspect__icons">
				<SuspectKick />
				<SuspectKick />
				<SuspectKick />
			</div>
			<H1>{$LL.game.trailingSuspect[5]({ sex })}</H1>
		{/if}

		{#if sceneIndex === '5'}
			<div class="trailing-suspect__icons">
				<SuspectRun />
				<SuspectRun />
				<SuspectRun />
			</div>
			<H1>{$LL.game.trailingSuspect[6]({ sex })}</H1>
		{/if}

		{#if sceneIndex === '6'}
			<div class="trailing-suspect__icons">
				<SuspectPolice />
				<SuspectPolice />
				<SuspectPolice />
			</div>
			<H1>{$LL.game.trailingSuspect[7]()}</H1>
		{/if}
	</main>
{/if}

<style lang="scss">
	main.trailing-suspect {
		z-index: 10;
		position: absolute;
		height: 100%;
		width: 100%;
		display: flex;
		align-items: center;
		flex-direction: column;
		justify-content: center;
		text-align: center;
		gap: 16px;
		box-sizing: border-box;
		border-radius: 16px;
		padding-inline: var(--layout-inline);
		background-color: var(--color-neutral-900);

		@media (max-width: 512px) {
			border-bottom-left-radius: unset;
			border-bottom-right-radius: unset;
		}

		&--danger {
			background-color: var(--color-danger);
		}

		&--capture {
			background-color: var(--color-capture);
		}
	}

	span.trailing-suspect__suspect {
		color: var(--color-danger);
	}

	div.trailing-suspect__icons {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 32px;
		margin-bottom: 16px;
	}

	@keyframes fadeAnimation {
		0%,
		100% {
			opacity: 0;
		}
		25% {
			transform: translateY(-4px);
		}
		50% {
			opacity: 1;
			transform: translateY(0);
		}
		75% {
			transform: translateY(-4px);
		}
	}

	:global(div.trailing-suspect__icons > svg) {
		animation: fadeAnimation 2s infinite ease-in-out;
		opacity: 0;
	}

	:global(div.trailing-suspect__icons > svg:nth-child(1)) {
		animation-delay: 0s;
	}

	:global(div.trailing-suspect__icons > svg:nth-child(2)) {
		animation-delay: 0.25s;
	}

	:global(div.trailing-suspect__icons > svg:nth-child(3)) {
		animation-delay: 0.5s;
	}
</style>
