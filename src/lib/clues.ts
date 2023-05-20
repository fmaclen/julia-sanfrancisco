import type { Atlas } from '$lib/atlases';
import { Place } from '$lib/scenes';
import type { Suspect } from '$lib/suspects';
import en from '../i18n/en';
import type { TranslationFunctions } from '../i18n/i18n-types';
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

// NOTE:
// In generalt I'm not sure this is the correct way of working with LL.
// All I'm trying with this is to loop through the translated strings applying
// the parameters all at once to get an array with all of the clues as a string.
//
// I'm not sure why I can't import `BaseTranslationFunction[]` (the type `LL.clues` is)
// as a type so I could use it as `translations: BaseTranslationFunction[]`.
function getTranslatedClues(clueSources: ClueSources): string[] {
	const params = {
		sex: clueSources?.suspect?.sex,
		currency: clueSources?.atlas?.currency,
		language: clueSources?.atlas?.language,
		flag: clueSources?.atlas?.flag
	};

	const translatedClues: string[] = [];

	for (let i = 0; i < en.clues[clueSources.type].length; i++) {
		console.log('{ params }', { params });
		console.log('clueSources.type', clueSources.type);
		console.log('LL.clues[clueSources.type]', LL.clues[clueSources.type]);
		console.log('LL.clues[clueSources.type][i]', LL.clues[clueSources.type][i]);
		console.log(
			'LL.clues[clueSources.type][i]({ params })',
			LL.clues[clueSources.type][i]({ params })
		);
		console.log('--------------------------------');
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
	const topicClues = getTranslatedClues({ atlas, suspect, type: 'topic' });
	const placeClues = getTranslatedClues({ atlas, suspect, type: 'place' });
	const objectClues = getTranslatedClues({ atlas, suspect, type: 'object' });
	const languageClues = getTranslatedClues({ atlas, suspect, type: 'language' });
	const planeClues = getTranslatedClues({ atlas, suspect, type: 'plane' });
	const shipClues = getTranslatedClues({ atlas, suspect, type: 'ship' });

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

		// General clues
		for (const clue of placeClues) {
			clues.push(`${intro} ${clue}.`);
		}

		for (const clue of objectClues) {
			clues.push(`${intro} ${clue}.`);
		}

		for (const clue of languageClues) {
			clues.push(`${intro} ${clue}.`);
		}
	}

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
