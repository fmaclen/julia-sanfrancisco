<script lang="ts">
	import { ARGENTINA } from '$lib/atlases/argentina';
	import { AUSTRALIA } from '$lib/atlases/australia';
	import { CHINA } from '$lib/atlases/china';
	import { GREECE } from '$lib/atlases/greece';
	import { ITALY } from '$lib/atlases/italy';
	import { JAPAN } from '$lib/atlases/japan';
	import { NORWAY } from '$lib/atlases/norway';
	import { USA } from '$lib/atlases/usa';
	import { Witness, type Game, Place, type Atlas, type Suspect, type Round } from '$lib/helpers';
	import { SUSPECTS } from '$lib/suspects';
	import { format } from 'date-fns';

	const atlases = [ARGENTINA, AUSTRALIA, CHINA, GREECE, ITALY, JAPAN, NORWAY, USA];
	const atlasesInRound = [...atlases];
	const startingLocation: Atlas = getRandomAtlas();

	function getStartTime() {
		const monday = new Date();
		monday.setUTCHours(9, 0, 0, 0); // Set time to 9:00 am
		monday.setUTCDate(monday.getUTCDate() - ((monday.getUTCDay() + 6) % 7)); // Set to the previous Monday
		return monday;
	}

	function getRandomAtlas(): Atlas {
		const atlas = getRandomValue(atlases);
		return atlas;
	}

	function getRandomStolenItem(): string {
		return getRandomValue(startingLocation.stolen);
	}

	function getRandomSuspect(): Suspect {
		return getRandomValue(SUSPECTS);
	}

	function getRounds(): Round[] {
		const rounds: Round[] = [];
		const NUMBER_OF_ROUNDS = 4;
		const roundAtlases: Atlas[] = [];

		// Set the first round
		roundAtlases.push(startingLocation);

		for (let i = 0; i < NUMBER_OF_ROUNDS; i++) {
			let atlasInRound = getRandomAtlas();

			// Prevent duplicate atlas in rounds
			while (roundAtlases.includes(atlasInRound)) atlasInRound = getRandomAtlas();
			roundAtlases.push(atlasInRound);

			// Remove the atlas from the list so it can't be used again
			atlasesInRound.splice(atlasesInRound.indexOf(atlasInRound), 1);
		}

		for (const roundAtlas of roundAtlases) {
			const previousRoundAtlas: Atlas = roundAtlases[roundAtlases.indexOf(roundAtlas) - 1];
			const nextRoundAtlas: Atlas = roundAtlases[roundAtlases.indexOf(roundAtlas) + 1];

			const destinations: Set<Atlas> = new Set();
			if (previousRoundAtlas) destinations.add(previousRoundAtlas);
			if (nextRoundAtlas) destinations.add(nextRoundAtlas);

			setRandomDestinations(destinations, roundAtlas)

			rounds.push({
				atlas: roundAtlas,
				scenes: [
					{
						place: Place.AIRPORT,
						witness: Witness.PILOT,
						clue: `Yup, saw them leave on a plane with a ${nextRoundAtlas?.city} flag on the tail.`
					}
				],
				destinations
			});
		}

		return rounds;
	}

	function setRandomDestinations(destinations: Set<Atlas>, currentAtlas: Atlas) {
		const MAX_DESTINATIONS = 5;

		while (destinations.size < MAX_DESTINATIONS) {
			const randomAtlas = getRandomAtlas();

			// Do not add the current atlas as a possible destination
			if (randomAtlas !== currentAtlas) destinations.add(randomAtlas);
		}
	}

	function getRandomValue<T>(array: T[]): T {
		return array[Math.floor(Math.random() * array.length)];
	}

	////////////////////////////////////////////////////////////

	const game: Game = {
		currentTime: getStartTime(),
		stolenTreasure: getRandomStolenItem(),
		suspect: getRandomSuspect(),
		rounds: getRounds()
	};

	$: currentRoundIndex = 0;
	$: currentRound = game.rounds[currentRoundIndex];

	function setDecoyRound(atlas: Atlas) {
		// Make sure the user can come back to where the suspect was last seen
		const destinations = new Set<Atlas>();
		const anchorDestination = game.rounds[currentRoundIndex].atlas;
		destinations.add(anchorDestination);

		setRandomDestinations(destinations, atlas);

		currentRound = {
			atlas,
			scenes: [
				{
					place: Place.LIBRARY,
					witness: Witness.ARCHIVIST,
					clue: "Didn't see anyone matching that description."
				}
			],
			destinations
		};
	}

	function travelTo(destination: Atlas) {
		const { rounds } = game;

		const isPreviousRoundAtlas =
			currentRoundIndex !== 0 && rounds[currentRoundIndex - 1].atlas === destination;
		const isCurrentRound = rounds[currentRoundIndex].atlas === destination;
		const isNextRoundAtlas = rounds[currentRoundIndex + 1].atlas === destination;
		const isDecoyRound = !isCurrentRound && !isPreviousRoundAtlas && !isNextRoundAtlas;

		if (isCurrentRound) currentRound = rounds[currentRoundIndex];
		if (isPreviousRoundAtlas) currentRoundIndex -= 1;
		if (isNextRoundAtlas) currentRoundIndex += 1;
		if (isDecoyRound) setDecoyRound(destination);
	}
</script>

<form>
	<fieldset>
		<legend>Debug controls</legend>
		<p>
			<strong> rounds: </strong>
			{#each game.rounds as round, i}
				<u style={currentRoundIndex === i ? `color: tomato;` : ''}>
					{round.atlas.city} ({i})
				</u>
				&nbsp;
			{/each}
		</p>
		<button on:click={() => (currentRoundIndex -= 1)} disabled={currentRoundIndex === 0}>
			Prev round
		</button>
		<button
			on:click={() => (currentRoundIndex += 1)}
			disabled={currentRoundIndex === game.rounds.length - 1}>Next round</button
		>
	</fieldset>
</form>

<p>The stolen item is <u>{game.stolenTreasure}</u></p>
<p>The suspect sex is <u>{game.suspect.sex}</u></p>

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
	{#each Array.from(currentRound.destinations) as destination}
		<li>
			<button on:click={() => travelTo(destination)}>{destination.city}</button>
		</li>
	{/each}
</ul>

<hr />

<a href="/">Abandon game</a>
