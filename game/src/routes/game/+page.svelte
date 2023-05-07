<script lang="ts">
	import { ARGENTINA } from '$lib/atlas/argentina';
	import { CHINA } from '$lib/atlas/china';
	import { GREECE } from '$lib/atlas/greece';
	import { NORWAY } from '$lib/atlas/norway';
	import { USA } from '$lib/atlas/usa';
	import { Witness, type Game, Place, type Atlas } from '$lib/helpers';
	import { format } from 'date-fns';

	const game: Game = {
		currentTime: new Date(),
		stolenTreasure: ARGENTINA.stolen[0],
		suspect: {
			name: 'Julia Sanfrancisco',
			hobby: 'mountain climbing',
			hair: 'brown',
			feature: 'mole on her left cheek',
			vehicle: 'convertible',
			sex: 'female',
			subjectPronoun: 'she',
			possesivePronoun: 'her'
		},
		rounds: [
			{
				atlas: ARGENTINA,
				scenes: [
					{
						place: Place.AIRPORT,
						witness: Witness.PILOT,
						clue: 'She was in a hurry to catch a plane with a red and white flag on the tail.'
					}
				],
				destinations: [CHINA, USA, GREECE, NORWAY]
			},
			{
				atlas: CHINA,
				scenes: [
					{
						place: Place.AIRPORT,
						witness: Witness.PILOT,
						clue: 'She was in a hurry to catch a plane with a red, white and blue flag on the tail.'
					}
				],
				destinations: [USA, GREECE, NORWAY, ARGENTINA]
			},
			{
				atlas: USA,
				scenes: [
					{
						place: Place.AIRPORT,
						witness: Witness.PILOT,
						clue: 'She was in a hurry to catch a plane with a red and blue flag on the tail.'
					}
				],
				destinations: [NORWAY, GREECE, ARGENTINA, CHINA]
			},
			{
				atlas: NORWAY,
				scenes: [
					{
						place: Place.AIRPORT,
						witness: Witness.PILOT,
						clue: 'She was in a hurry to catch a plane with a blue and white flag on the tail.'
					}
				],
				destinations: [GREECE, CHINA, ARGENTINA, USA]
			},
			{
				atlas: GREECE,
				scenes: [
					{
						place: Place.AIRPORT,
						witness: Witness.PILOT,
						clue: 'She was in a hurry to catch a plane with a blue and white flag on the tail.'
					}
				],
				destinations: [USA, CHINA, ARGENTINA, NORWAY]
			}
		]
	};

	$: currentRoundIndex = 0;
	$: currentRound = game.rounds[currentRoundIndex];

	function setDecoyRound(destination: Atlas) {
		// Make sure the user can come back to where the suspect was last seen
		const anchorDestination = game.rounds[currentRoundIndex].atlas;

		currentRound = {
			atlas: destination,
			scenes: [
				{
					place: Place.LIBRARY,
					witness: Witness.ARCHIVIST,
					clue: "Didn't see anyone matching that description."
				}
			],
			destinations: [anchorDestination]
		};
	}

	function travelTo(destination: Atlas) {
		const { rounds } = game;
		const isPreviousRound =
			currentRoundIndex !== 0 && rounds[currentRoundIndex - 1].atlas === destination;
		const isCurrentRound = rounds[currentRoundIndex].atlas === destination;
		const isNextRound = rounds[currentRoundIndex + 1].atlas === destination;
		const isDecoyRound = !isCurrentRound && !isPreviousRound && !isNextRound;

		if (isCurrentRound) currentRound = rounds[currentRoundIndex];
		if (isPreviousRound) currentRoundIndex -= 1;
		if (isNextRound) currentRoundIndex += 1;
		if (isDecoyRound) setDecoyRound(destination);
	}
</script>

<div class="wrapper">
	<!-- Debug controls -->
	<button on:click={() => (currentRoundIndex -= 1)} disabled={currentRoundIndex === 0}
		>Prev round</button
	>
	<button
		on:click={() => (currentRoundIndex += 1)}
		disabled={currentRoundIndex === game.rounds.length - 1}>Next round</button
	>

	<h3>Round {currentRoundIndex}</h3>

	<hr />

	<h1>{currentRound.atlas.city}</h1>
	<h2>{format(game.currentTime, 'EEEE hh:mm aaa')}</h2>

	<hr />

	<h3>Clues</h3>

	<ul>
		{#each currentRound.scenes as scene}
			<li>
				<p>
					<strong>{scene.place}</strong><br />
					<strong>{scene.witness}</strong> — {scene.clue}
				</p>
			</li>
		{/each}
	</ul>

	<hr />

	<h3>Depart to</h3>

	<ul>
		{#each currentRound.destinations as destination}
			<li>
				<button on:click={() => travelTo(destination)}>{destination.city}</button>
			</li>
		{/each}
	</ul>
</div>

<style lang="scss">
	.wrapper {
		max-width: 640px;
		margin-inline: auto;
	}
</style>
