import type { Atlas } from '$lib/atlases';
import { Place } from '$lib/scenes';
import type { Suspect } from '$lib/suspects';
import en from '../i18n/en';
import { typesafeI18nObject } from 'typesafe-i18n';

const NEED_TO_IMPORT_THIS = 'en'; // FIXME!!!!!!!!!!!!!!!
console.warn('HARCODED TO ENGLISH, MUST MAKE IT DYNAMIC BEFORE MERGING');

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
		| 'finalRound'
		| 'decoy';
	atlas?: Atlas;
	suspect?: Suspect;
}

function getTranslatedClues(clueSources: ClueSources): string[] {
	// Applies these params to generate the localized clues
	const params = {
		// All params must be lowercase
		sex: clueSources.suspect?.sex.toLowerCase(),
		currency: clueSources.atlas?.currency.toLowerCase(),
		language: clueSources.atlas?.language.toLowerCase(),
		flag: clueSources.atlas?.flag.toLowerCase()
	};

	const translatedClues: string[] = [];

	for (let i = 0; i < en.clues[clueSources.type].length; i++) {
		const clue = LL.clues[clueSources.type][i](params);
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

	return clues;
}

export function getDecoyClues(): string[] {
	return getTranslatedClues({ type: 'decoy' });
}
