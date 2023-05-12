import { getRandomAtlas, type Atlas, setRandomDestinations } from './atlases';
import { getScenes, type Scene } from './scenes';
import type { Suspect } from './suspects';

export interface Round {
	atlas: Atlas;
	scenes: Scene[];
	destinations: Set<Atlas>;
}

// Generates the atlas, scenes, destinatinos, etc... for each round in the game
export function getRounds(
	startingDestination: Atlas,
	atlasesInRound: Atlas[],
	suspect: Suspect
): Round[] {
	const rounds: Round[] = [];
	const NUMBER_OF_ROUNDS = 4;
	const roundAtlases: Atlas[] = [];

	// Set the first round
	roundAtlases.push(startingDestination);

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

		setRandomDestinations(destinations, roundAtlas);

		const isRoundFinal = !nextRoundAtlas;

		rounds.push({
			atlas: roundAtlas,
			scenes: getScenes({ nextRoundAtlas, isRoundFinal, suspect }),
			destinations
		});
	}

	return rounds;
}

// Creates a temporary round without any clues when the user travels to an incorrect city
export function getDecoyRound(atlas: Atlas, anchorDestination: Atlas): Round {
	const destinations = new Set<Atlas>();

	// Make sure the user can come back to where the suspect was last seen
	destinations.add(anchorDestination);

	// Fill out the rest destinations with random ones
	setRandomDestinations(destinations, atlas);

	return {
		atlas,
		scenes: getScenes({ isRoundDecoy: true }),
		destinations
	};
}
