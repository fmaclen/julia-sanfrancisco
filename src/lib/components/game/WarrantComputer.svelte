<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import TerminalForm from '$lib/components/TerminalForm.svelte';
	import TerminalFormSelect from '$lib/components/TerminalFormSelect.svelte';
	import TerminalGroup from '$lib/components/TerminalGroup.svelte';
	import TerminalRows from '$lib/components/TerminalRows.svelte';
	import TerminalTitle from '$lib/components/TerminalTitle.svelte';
	import type { TranslationFunctions } from '$i18n/i18n-types';
	import {
		Suspect,
		WarrantFeature,
		WarrantHair,
		WarrantHobby,
		WarrantSex,
		WarrantVehicle
	} from '$lib/suspects';
	import { slide } from 'svelte/transition';

	interface Props {
		LL: TranslationFunctions;
		warrants: Suspect[];
		warrantWasComputed: boolean;
		warrantSex?: WarrantSex;
		warrantHobby?: WarrantHobby;
		warrantHair?: WarrantHair;
		warrantFeature?: WarrantFeature;
		warrantVehicle?: WarrantVehicle;
		isAnimating?: boolean;
		onCompute: () => void;
	}

	let {
		LL,
		warrants,
		warrantWasComputed,
		warrantSex = $bindable(),
		warrantHobby = $bindable(),
		warrantHair = $bindable(),
		warrantFeature = $bindable(),
		warrantVehicle = $bindable(),
		isAnimating = $bindable(false),
		onCompute
	}: Props = $props();

	let canComputeWarrant = $derived(
		warrantSex || warrantHobby || warrantHair || warrantFeature || warrantVehicle
	);
</script>

<TerminalGroup>
	<TerminalRows
		lines={[
			{
				text: `${LL.warrants.worldPolice()}: ${LL.warrants.warrants()}`,
				isTitle: true
			},
			{ text: LL.warrants.provideDetails() }
		]}
		bind:isAnimating
	/>

	{#if !isAnimating}
		<TerminalForm>
			<TerminalTitle>{LL.warrants.labels.sex()}</TerminalTitle>
			<TerminalFormSelect bind:value={warrantSex}>
				{#each Object.values(WarrantSex) as sex}
					<option value={sex}>{LL.warrants.sex[sex]()}</option>
				{/each}
			</TerminalFormSelect>

			<TerminalTitle>{LL.warrants.labels.hobby()}</TerminalTitle>
			<TerminalFormSelect bind:value={warrantHobby}>
				{#each Object.values(WarrantHobby) as hobby}
					<option value={hobby}>{LL.warrants.hobby[hobby]()}</option>
				{/each}
			</TerminalFormSelect>

			<TerminalTitle>{LL.warrants.labels.hair()}</TerminalTitle>
			<TerminalFormSelect bind:value={warrantHair}>
				{#each Object.values(WarrantHair) as hair}
					<option value={hair}>{LL.warrants.hair[hair]()}</option>
				{/each}
			</TerminalFormSelect>

			<TerminalTitle>{LL.warrants.labels.feature()}</TerminalTitle>
			<TerminalFormSelect bind:value={warrantFeature}>
				{#each Object.values(WarrantFeature) as feature}
					<option value={feature}>{LL.warrants.feature[feature]()}</option>
				{/each}
			</TerminalFormSelect>

			<TerminalTitle>{LL.warrants.labels.vehicle()}</TerminalTitle>
			<TerminalFormSelect bind:value={warrantVehicle}>
				{#each Object.values(WarrantVehicle) as vehicle}
					<option value={vehicle}>{LL.warrants.vehicle[vehicle]()}</option>
				{/each}
			</TerminalFormSelect>
		</TerminalForm>

		<ul class="terminal-group-buttons" in:slide|global>
			<li class="terminal-group-buttons__li">
				<Button onclick={onCompute} disabled={!canComputeWarrant} transparent={true}>
					{LL.warrants.compute()}
				</Button>
			</li>
		</ul>

		{#if warrantWasComputed}
			{#if warrants.length > 1}
				<TerminalRows
					shouldAutoScroll={true}
					lines={[
						{ text: LL.warrants.possibleSuspects(), isTitle: true },
						...warrants.map((suspect) => ({
							text: LL.suspects[suspect].name()
						}))
					]}
				/>
			{:else if warrants.length > 0}
				<TerminalRows
					shouldAutoScroll={true}
					lines={[
						{ text: LL.warrants.suspectMatch(), isTitle: true },
						{
							text: LL.warrants.haveWarrant({
								suspect: LL.suspects[warrants[0]].name()
							})
						}
					]}
				/>
			{:else}
				<TerminalRows
					shouldAutoScroll={true}
					lines={[
						{ text: LL.warrants.noSuspectsFound(), isTitle: true },
						{ text: LL.warrants.noPossibleSuspects() }
					]}
				/>
			{/if}
		{/if}
	{/if}
</TerminalGroup>

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
