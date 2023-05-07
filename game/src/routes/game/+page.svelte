<script lang="ts">
	import { ARGENTINA } from '$lib/atlases/argentina';
	import { CHINA } from '$lib/atlases/china';
	import { GREECE } from '$lib/atlases/greece';
	import { NORWAY } from '$lib/atlases/norway';
	import { USA } from '$lib/atlases/usa';
	import { Witness, type Game, Place, type Atlas, type Suspect, type Round } from '$lib/helpers';
	import { SUSPECTS } from '$lib/suspects';
	import { format } from 'date-fns';

	const startingLocation: Atlas = getRandomAtlas();
	const atlases = [ARGENTINA, CHINA, GREECE, NORWAY, USA];

	function getStartTime() {
		const monday = new Date();
		monday.setUTCHours(9, 0, 0, 0); // Set time to 9:00 am
		monday.setUTCDate(monday.getUTCDate() - ((monday.getUTCDay() + 6) % 7)); // Set to the previous Monday
		return monday;
	}

	function getRandomAtlas(): Atlas {
		const atlas = getRandomValue(atlases);
		atlases.splice(atlases.indexOf(atlas), 1); // Remove the atlas from the list so it can't be used again
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
			roundAtlases.push(getRandomAtlas());
		}

		for (const roundAtlas of roundAtlases) {
			const previousRoundAtlas: Atlas = roundAtlases[roundAtlases.indexOf(roundAtlas) - 1];
			const nextRoundAtlas: Atlas = roundAtlases[roundAtlases.indexOf(roundAtlas) + 1];

			const destinations: Set<Atlas> = new Set();
			if (previousRoundAtlas) destinations.add(previousRoundAtlas);
			if (nextRoundAtlas) destinations.add(nextRoundAtlas);

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

	function setDecoyRound(destination: Atlas) {
		// Make sure the user can come back to where the suspect was last seen
		const destinations = new Set<Atlas>();
		const anchorDestination = game.rounds[currentRoundIndex].atlas;
		destinations.add(anchorDestination);

		currentRound = {
			atlas: destination,
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
