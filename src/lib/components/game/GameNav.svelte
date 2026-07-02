<script lang="ts">
	import ButtonIcon from '$lib/components/ButtonIcon.svelte';
	import type { TranslationFunctions } from '$i18n/i18n-types';
	import Back from '$lib/icons/Back.svg.svelte';
	import Collapse from '$lib/icons/Collapse.svg.svelte';
	import Expand from '$lib/icons/Expand.svg.svelte';
	import IconFly from '$lib/icons/Fly.svg.svelte';
	import IconMenu from '$lib/icons/Menu.svg.svelte';
	import IconWalk from '$lib/icons/Walk.svg.svelte';
	import { fade } from 'svelte/transition';

	interface Props {
		LL: TranslationFunctions;
		isClueVisible: boolean;
		showDossiers: boolean;
		hasSuspectDossier: boolean;
		showWarrant: boolean;
		showPostcard: boolean;
		isWalking: boolean;
		isFlying: boolean;
		showPlaces: boolean;
		showDestinations: boolean;
		showOptions: boolean;
		onDismissClue: () => void | Promise<void>;
		onToggleOptions: () => void;
		onSeeDossiers: () => void;
		onTogglePostcard: () => void;
		onWalkTo: () => void;
		onFlyTo: () => void;
	}

	let {
		LL,
		isClueVisible,
		showDossiers,
		hasSuspectDossier,
		showWarrant,
		showPostcard,
		isWalking,
		isFlying,
		showPlaces,
		showDestinations,
		showOptions,
		onDismissClue,
		onToggleOptions,
		onSeeDossiers,
		onTogglePostcard,
		onWalkTo,
		onFlyTo
	}: Props = $props();
</script>

<nav class="game-nav" transition:fade|global>
	{#if isClueVisible}
		<ButtonIcon onclick={onDismissClue} title={LL.components.buttons.goBack()}>
			<Back />
		</ButtonIcon>
	{:else if showDossiers}
		<ButtonIcon onclick={onToggleOptions} title={LL.components.buttons.goBack()}>
			<Back />
		</ButtonIcon>
	{:else if hasSuspectDossier}
		<ButtonIcon onclick={onSeeDossiers} title={LL.components.buttons.goBack()}>
			<Back />
		</ButtonIcon>
	{:else if showWarrant}
		<ButtonIcon onclick={onToggleOptions} title={LL.components.buttons.goBack()}>
			<Back />
		</ButtonIcon>
	{:else if showPostcard}
		<ButtonIcon onclick={onTogglePostcard} title={LL.game.actions.hidePostcard()}>
			<Expand />
		</ButtonIcon>
	{:else}
		<ButtonIcon onclick={onTogglePostcard} title={LL.game.actions.showPostcard()}>
			<Collapse />
		</ButtonIcon>
		<ButtonIcon onclick={onWalkTo} active={isWalking || showPlaces} title={LL.game.actions.walk()}>
			<IconWalk />
		</ButtonIcon>
		<ButtonIcon
			onclick={onFlyTo}
			active={isFlying || showDestinations}
			title={LL.game.actions.fly()}
		>
			<IconFly />
		</ButtonIcon>
		<ButtonIcon onclick={onToggleOptions} title={LL.game.actions.options()} active={showOptions}>
			<IconMenu />
		</ButtonIcon>
	{/if}
</nav>

<style lang="scss">
	nav.game-nav {
		display: flex;
		justify-content: space-between;
		margin-inline: var(--layout-inline);
	}
</style>
