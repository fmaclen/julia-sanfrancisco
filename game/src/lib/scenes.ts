import type { Atlas } from './atlases';
import { Place, Witness } from './helpers';

export interface Scene {
	place: Place;
	witness: Witness;
	clue: string;
}

export function getScenes({
	nextRoundAtlas,
	isRoundFinal,
	isRoundDecoy
}: {
	nextRoundAtlas?: Atlas;
	isRoundFinal?: boolean;
	isRoundDecoy?: boolean;
}): Scene[] {
	let scenes: Scene[] = [];

	// Round with clues
	if (nextRoundAtlas) {
		scenes = [
			{
				place: Place.LIBRARY,
				witness: Witness.ARCHIVIST,
				clue: `Yup, saw them leave on a plane with a ${nextRoundAtlas?.city} flag on the tail.`
			}
		];
	}

	// Final round
	if (isRoundFinal) {
		scenes = [
			{
				place: Place.MARKETPLACE,
				witness: Witness.URCHIN,
				clue: `You are getting too close gumshoe.`
			}
		];
	}

	// Decoy round
	if (isRoundDecoy) {
		scenes = [
			{
				place: Place.AIRPORT,
				witness: Witness.PILOT,
				clue: "Didn't see anyone matching that description."
			}
		];
	}

	return scenes;
}
