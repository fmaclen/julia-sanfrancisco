<script lang="ts">
	import LL from '$i18n/i18n-svelte';
	import Artwork from '$lib/components/Artwork.svelte';
	import Button from '$lib/components/Button.svelte';
	import ClueDisplay from '$lib/components/game/ClueDisplay.svelte';
	import DestinationsList from '$lib/components/game/DestinationsList.svelte';
	import GameNav from '$lib/components/game/GameNav.svelte';
	import PlacesList from '$lib/components/game/PlacesList.svelte';
	import SuspectDossiers from '$lib/components/game/SuspectDossiers.svelte';
	import WarrantComputer from '$lib/components/game/WarrantComputer.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import H1 from '$lib/components/H1.svelte';
	import Header from '$lib/components/Header.svelte';
	import Main from '$lib/components/Main.svelte';
	import P from '$lib/components/P.svelte';
	import Section from '$lib/components/Section.svelte';
	import Time from '$lib/components/Time.svelte';
	import TrailingSuspect from '$lib/components/TrailingSuspect.svelte';
	import { getRandomValue } from '$lib/helpers';
	import GamePageState from '$lib/state/game-page.svelte';
	import { untrack } from 'svelte';
	import { fade, slide } from 'svelte/transition';

	const gamePage = new GamePageState(() => $LL);

	$effect(() => {
		gamePage.finishGame();
	});

	$effect(() => {
		return untrack(() => gamePage.startClock());
	});
</script>

{#if gamePage.game}
	<Main>
		<Artwork
			isHighContrast={!gamePage.showPostcard}
			isHidden={gamePage.isArtworkHidden}
			isDisabled={gamePage.isSleeping}
			src={gamePage.artworkPath}
		/>

		{#if gamePage.isTrailingSuspect}
			<TrailingSuspect
				sceneIndex={gamePage.trailingSuspectScene}
				sex={gamePage.game.suspect.warrantKeys.sex}
			/>
		{/if}

		{#snippet header()}
			<Header>
				<H1>
					{gamePage.isSleeping
						? $LL.game.actions.sleeping() + '...'
						: gamePage.isFlying
							? $LL.game.actions.flying() + '...'
							: gamePage.isWalking
								? $LL.game.actions.walking() + '...'
								: gamePage.currentRound.atlas.city}
				</H1>

				{#if gamePage.isClockTicking || !gamePage.showPostcard}
					<Time
						isClockTicking={gamePage.isClockTicking}
						currentTime={gamePage.currentTimeFormatted}
					/>
				{/if}
			</Header>
		{/snippet}

		{#snippet footer()}
			<Footer>
				{#if !gamePage.showPostcard}
					{#if !gamePage.isTimeUp && !gamePage.isSleeping && !gamePage.isClockTicking && gamePage.showDescription}
						<Section>
							<section class="paragraph-group" in:fade|global>
								<P>{getRandomValue(gamePage.currentRound.atlas.descriptions)}</P>
							</section>
						</Section>
					{/if}

					{#if gamePage.showPlaces}
						<PlacesList
							scenes={gamePage.currentRound.scenes}
							currentClueIndex={gamePage.currentClueIndex}
							onSelect={gamePage.getClue}
						/>
					{/if}

					{#if gamePage.isClueVisible && gamePage.currentClueIndex !== null}
						<ClueDisplay scene={gamePage.currentRound.scenes[gamePage.currentClueIndex]} />
					{/if}

					{#if gamePage.showDestinations}
						<DestinationsList
							destinations={gamePage.currentRound.destinations}
							onSelect={gamePage.setRound}
						/>
					{/if}

					{#if gamePage.showOptions}
						<Section>
							<Button onclick={gamePage.abandonGame}>{$LL.game.actions.abandon()}</Button>
						</Section>

						<Section>
							<section class="button-group" in:slide|global>
								<Button onclick={gamePage.seeDossiers}>{$LL.warrants.suspectDossiers()}</Button>
								<Button onclick={gamePage.getWarrant}>{$LL.warrants.getWarrant()}</Button>
							</section>
						</Section>
					{/if}

					{#if gamePage.showDossiers}
						<SuspectDossiers
							LL={$LL}
							bind:isAnimating={gamePage.isAnimating}
							onSelect={gamePage.seeDossier}
						/>
					{/if}

					{#if gamePage.showSuspectDossier}
						<SuspectDossiers
							LL={$LL}
							selectedSuspect={gamePage.showSuspectDossier}
							bind:isAnimating={gamePage.isAnimating}
							onSelect={gamePage.seeDossier}
						/>
					{/if}

					{#if gamePage.showWarrant}
						<WarrantComputer
							LL={$LL}
							warrants={gamePage.game.warrants}
							warrantWasComputed={gamePage.warrantWasComputed}
							bind:warrantSex={gamePage.warrantSex}
							bind:warrantHobby={gamePage.warrantHobby}
							bind:warrantHair={gamePage.warrantHair}
							bind:warrantFeature={gamePage.warrantFeature}
							bind:warrantVehicle={gamePage.warrantVehicle}
							bind:isAnimating={gamePage.isAnimating}
							onCompute={gamePage.computeWarrant}
						/>
					{/if}
				{/if}

				{#if !gamePage.isClockTicking}
					<GameNav
						LL={$LL}
						isClueVisible={gamePage.isClueVisible}
						showDossiers={gamePage.showDossiers}
						hasSuspectDossier={!!gamePage.showSuspectDossier}
						showWarrant={gamePage.showWarrant}
						showPostcard={gamePage.showPostcard}
						isWalking={gamePage.isWalking}
						isFlying={gamePage.isFlying}
						showPlaces={gamePage.showPlaces}
						showDestinations={gamePage.showDestinations}
						showOptions={gamePage.showOptions}
						onDismissClue={gamePage.dismissClue}
						onToggleOptions={gamePage.toggleOptions}
						onSeeDossiers={gamePage.seeDossiers}
						onTogglePostcard={gamePage.togglePostcard}
						onWalkTo={gamePage.walkTo}
						onFlyTo={gamePage.flyTo}
					/>
				{/if}
			</Footer>
		{/snippet}
	</Main>
{/if}

<style lang="scss">
	section.button-group {
		display: flex;
		flex-direction: column;
		width: 100%;
		gap: 4px;
		max-height: 50dvh;
		overflow-y: auto;
	}
</style>
