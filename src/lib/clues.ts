import type { Atlas } from '$lib/atlases';
import { Place } from '$lib/scenes';
import type { Suspect } from '$lib/suspects';
import en from '../i18n/en';
import { typesafeI18nObject } from 'typesafe-i18n';

const NEED_TO_IMPORT_THIS = 'en';

const LL = typesafeI18nObject(NEED_TO_IMPORT_THIS, en);

interface ClueSources {
	type:
		| 'introduction'
		| 'place'
		| 'language'
		| 'currency'
		| 'object'
		| 'topic'
		| 'plane'
		| 'ship'
		| 'finalRound';
	atlas?: Atlas;
	suspect?: Suspect;
}

function getTranslatedClues(clueSources: ClueSources): string[] {
	// Applies these params to generate the localized clues
	const params = {
		sex: clueSources?.suspect?.sex,
		currency: clueSources?.atlas?.currency,
		language: clueSources?.atlas?.language,
		flag: clueSources?.atlas?.flag
	};

	const translatedClues: string[] = [];

	for (let i = 0; i < en.clues[clueSources.type].length; i++) {
		const clue = LL.clues[clueSources.type][i]({ params });
		translatedClues.push(clue);
	}

	return translatedClues;
}

export const finalRoundClues = getTranslatedClues({ type: 'finalRound' });

export function generateClues(atlas: Atlas, suspect: Suspect, place: Place): string[] {
	const currencyPlaces = [Place.BANK, Place.STOCK_EXCHANGE, Place.HOTEL, Place.AIRPORT];
	const topicPlaces = [Place.MUSEUM, Place.LIBRARY];
	const shipPlaces = [Place.HARBOR, Place.RIVERFRONT];

	const introductions = getTranslatedClues({ atlas, suspect, type: 'introduction' });
	const currencyClues = getTranslatedClues({ atlas, suspect, type: 'currency' });
	const languageClues = getTranslatedClues({ atlas, suspect, type: 'language' });
	const planeClues = getTranslatedClues({ atlas, suspect, type: 'plane' });
	const shipClues = getTranslatedClues({ atlas, suspect, type: 'ship' });

	// These clues are multiplied by the number of topics, places and objects in each atlas.
	const topicClues = getTranslatedClues({ atlas, suspect, type: 'topic' });
	const placeClues = getTranslatedClues({ atlas, suspect, type: 'place' });
	const objectClues = getTranslatedClues({ atlas, suspect, type: 'object' });

	const clues = [];

	for (const intro of introductions) {
		// Currency clues
		if (currencyPlaces.includes(place)) {
			for (const clue of currencyClues) {
				clues.push(`${intro} ${clue}.`);
			}
		}

		// Topic clues
		if (topicPlaces.includes(place)) {
			for (const clue of topicClues) {
				clues.push(`${intro} ${clue}.`);
			}
		}

		// Plane clues
		if (place === Place.AIRPORT) {
			for (const clue of planeClues) {
				clues.push(`${intro} ${clue}.`);
			}
		}

		// Ship clues
		if (shipPlaces.includes(place)) {
			for (const clue of shipClues) {
				clues.push(`${intro} ${clue}.`);
			}
		}

		// No-place specific clues
		for (const clue of placeClues) {
			atlas.places.forEach((place) => {
				clues.push(`${intro} ${clue} ${place}.`);
			});
		}

		for (const clue of objectClues) {
			atlas.objects.forEach((object) => {
				clues.push(`${intro} ${clue} ${object}.`);
			});
		}

		for (const clue of languageClues) {
			clues.push(`${intro} ${clue}.`);
		}
	}

	console.log(clues);

	return clues;
}

export function getDecoyClues(place: string): string[] {
	return [
		"Didn't see anyone matching that description.",
		`Sorry, I haven't noticed anything suspicious around the ${place}.`,
		"Sorry, I haven't seen anybody like that around here.",
		`I've never seen anyone like that around the ${place}.`
	];
}
