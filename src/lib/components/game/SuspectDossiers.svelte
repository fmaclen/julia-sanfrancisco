<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import TerminalForm from '$lib/components/TerminalForm.svelte';
	import TerminalGroup from '$lib/components/TerminalGroup.svelte';
	import TerminalParagraph from '$lib/components/TerminalParagraph.svelte';
	import TerminalRows from '$lib/components/TerminalRows.svelte';
	import TerminalTitle from '$lib/components/TerminalTitle.svelte';
	import type { TranslationFunctions } from '$i18n/i18n-types';
	import { Suspect } from '$lib/suspects';
	import { slide } from 'svelte/transition';

	interface Props {
		LL: TranslationFunctions;
		selectedSuspect?: Suspect;
		isAnimating?: boolean;
		onSelect: (suspect: Suspect) => void;
	}

	let { LL, selectedSuspect, isAnimating = $bindable(false), onSelect }: Props = $props();
</script>

{#if selectedSuspect}
	{@const suspect = LL.suspects[selectedSuspect]}
	{@const warrants = LL.warrants}
	<TerminalGroup>
		<TerminalRows
			lines={[
				{
					text: `${LL.warrants.worldPolice()}: ${LL.warrants.suspectDossiers()}`,
					isTitle: true
				}
			]}
			bind:isAnimating
		/>

		{#if !isAnimating}
			<TerminalForm>
				<TerminalTitle>{warrants.labels.name()}</TerminalTitle>
				<TerminalParagraph>{suspect.name()}</TerminalParagraph>

				<TerminalTitle>{warrants.labels.sex()}</TerminalTitle>
				<TerminalParagraph>{suspect.sex()}</TerminalParagraph>

				<TerminalTitle>{warrants.labels.occupation()}</TerminalTitle>
				<TerminalParagraph>{suspect.occupation()}</TerminalParagraph>

				<TerminalTitle>{warrants.labels.hobby()}</TerminalTitle>
				<TerminalParagraph>{suspect.hobby()}</TerminalParagraph>

				<TerminalTitle>{warrants.labels.hair()}</TerminalTitle>
				<TerminalParagraph>{suspect.hair()}</TerminalParagraph>

				<TerminalTitle>{warrants.labels.vehicle()}</TerminalTitle>
				<TerminalParagraph>{suspect.vehicle()}</TerminalParagraph>

				<TerminalTitle>{warrants.labels.feature()}</TerminalTitle>
				<TerminalParagraph>{suspect.feature()}</TerminalParagraph>

				<TerminalTitle>{warrants.labels.other()}</TerminalTitle>
				<TerminalParagraph>{suspect.other()}</TerminalParagraph>
			</TerminalForm>
		{/if}
	</TerminalGroup>
{:else}
	<TerminalGroup>
		<TerminalRows
			lines={[
				{
					text: `${LL.warrants.worldPolice()}: ${LL.warrants.suspectDossiers()}`,
					isTitle: true
				}
			]}
			bind:isAnimating
		/>
		<ul class="terminal-group-buttons" in:slide|global>
			{#each Object.values(Suspect) as suspectKey}
				<li class="terminal-group-buttons__li">
					<Button onclick={() => onSelect(suspectKey)} transparent={true}>
						{LL.suspects[suspectKey].name()}
					</Button>
				</li>
			{/each}
		</ul>
	</TerminalGroup>
{/if}

<style lang="scss">
	ul.terminal-group-buttons {
		list-style: unset;
		padding-inline: unset;
		margin-block: unset;
	}

	li.terminal-group-buttons__li {
		border-top: 1px dashed var(--color-neutral-500);
	}
</style>
