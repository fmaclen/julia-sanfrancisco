<script lang="ts">
	import LL from '$i18n/i18n-svelte';
	import H1 from '$lib/components/H1.svelte';
	import SuspectFall from '../icons/SuspectFall.svg.svelte';
	import SuspectFingerprint from '../icons/SuspectFingerprint.svg.svelte';
	import SuspectHacker from '../icons/SuspectHacker.svg.svelte';
	import SuspectKick from '../icons/SuspectKick.svg.svelte';
	import SuspectPolice from '../icons/SuspectPolice.svg.svelte';
	import SuspectRappel from '../icons/SuspectRappel.svg.svelte';
	import SuspectRun from '../icons/SuspectRun.svg.svelte';
	import SuspectSki from '../icons/SuspectSki.svg.svelte';
	import type { WarrantSex } from '../suspects';

	export let sex: WarrantSex;
	export let sceneIndex: number = 0;
</script>

<main
	class="trailing-suspect {sceneIndex === 6 ? 'trailing-suspect--danger' : ''} {sceneIndex === 7
		? 'trailing-suspect--capture'
		: ''}"
>
	{#if sceneIndex === 0}
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

	{#if sceneIndex === 1}
		<div class="trailing-suspect__icons">
			<SuspectFall />
			<SuspectFall />
			<SuspectFall />
		</div>
		<H1>{$LL.game.trailingSuspect[2]()}</H1>
	{/if}

	{#if sceneIndex === 2}
		<div class="trailing-suspect__icons">
			<SuspectHacker />
			<SuspectHacker />
			<SuspectHacker />
		</div>
		<H1>{$LL.game.trailingSuspect[3]()}</H1>
	{/if}

	{#if sceneIndex === 3}
		<div class="trailing-suspect__icons">
			<SuspectSki />
			<SuspectSki />
			<SuspectSki />
		</div>
		<H1>{$LL.game.trailingSuspect[4]({ sex })}</H1>
	{/if}

	{#if sceneIndex === 4}
		<div class="trailing-suspect__icons">
			<SuspectKick />
			<SuspectKick />
			<SuspectKick />
		</div>
		<H1>{$LL.game.trailingSuspect[5]()}</H1>
	{/if}

	{#if sceneIndex === 5}
		<div class="trailing-suspect__icons">
			<SuspectFingerprint />
			<SuspectFingerprint />
			<SuspectFingerprint />
		</div>
		<H1>{$LL.game.trailingSuspect[6]({ sex })}</H1>
	{/if}

	{#if sceneIndex === 6}
		<div class="trailing-suspect__icons">
			<SuspectRun />
			<SuspectRun />
			<SuspectRun />
		</div>
		<H1>{$LL.game.trailingSuspect[7]({ sex })}</H1>
	{/if}

	{#if sceneIndex === 7}
		<div class="trailing-suspect__icons">
			<SuspectPolice />
			<SuspectPolice />
			<SuspectPolice />
		</div>
		<H1>{$LL.game.trailingSuspect[8]()}</H1>
	{/if}
</main>

<style lang="scss">
	main.trailing-suspect {
		height: 100%;
		width: 100%;
		display: flex;
		align-items: center;
		flex-direction: column;
		justify-content: center;
		text-align: center;
		gap: 16px;
		box-sizing: border-box;
		padding-inline: var(--layout-inline);

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
		gap: 24px;
		margin-bottom: 16px;

		> svg {
			opacity: 0;
		}
	}

	@keyframes fadeAnimation {
		0%,
		100% {
			transform: translateY(0);
			opacity: 0;
		}
		50% {
			transform: translateY(-16px);
			opacity: 1;
		}
	}

	:global(div.trailing-suspect__icons > svg) {
		animation: fadeAnimation 2s infinite ease-in-out;
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
