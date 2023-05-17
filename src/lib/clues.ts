import type { Atlas } from '$lib/atlases';
import { Place } from '$lib/scenes';
import type { Suspect } from '$lib/suspects';

export const FINAL_ROUND_CLUES = [
	"The word is out, you're getting too close gumshoe...",
	'Rumor has it that the gang is in town somewhere.',
	'All I know is that something suspicious is happening in town.',
	'The only thing I can tell you is to watch your step.'
];

export function generateClues(atlas: Atlas, suspect: Suspect, place: Place): string[] {
	const introductions = [
		"I saw the person you're looking for and",
		'The person you are looking for was here and',
		'My sources tell me',
		'A reliable source told me',
		'Sources tell me',
		'All I know is that',
		'A suspicious person was here and',
		'I heard'
	];

	const currencyPlaces = [Place.BANK, Place.STOCK_EXCHANGE, Place.HOTEL, Place.AIRPORT];
	const topicPlaces = [Place.MUSEUM, Place.LIBRARY];
	const shipPlaces = [Place.HARBOR, Place.RIVERFRONT];

	const placeClues = [
		`said ${suspect.pronouns.subject} wanted to photograph`,
		`asked for a map of`,
		`planned to visit`,
		`mentioned ${suspect.pronouns.subject} wanted to see`,
		`was considering taking a trip to`,
		`had an urge to visit`,
		`said ${suspect.pronouns.subject} wanted to explore`,
		`asked about day tours to`,
		`wanted to know if there were any five-star hotels near`
	];

	const languageClues = [
		`had a ${atlas.language} dictionary in ${suspect.pronouns.possessive} pocket`,
		`was carrying a ${atlas.language} phrase book`
	];

	const currencyClues = [
		`changed ${suspect.pronouns.possessive} money to ${atlas.currency}`,
		`asked about the exchange rate for ${atlas.currency}`,
		`wanted to know how much ${atlas.currency} were worth`
	];

	const objectClues = [
		`was carrying a`,
		`wanted to buy`,
		`wanted to sell a rare`,
		`asked where to find`,
		`was looking for`
	];

	const topicClues = [`was researching`, `wanted to study`, `was interested in`, `asked about`];

	const planeClues = [
		`left in a plane with a ${atlas.flag} on its wing`,
		`was in a rush to catch a plane with a ${atlas.flag} on its wing`,
		`flew away on a plane with a ${atlas.flag} on its tail`
	];

	const shipClues = [
		`sailed away on a ship flying a ${atlas.flag} flag`,
		`left on a ship with a ${atlas.flag} flag`
	];

	const clues = [];

	for (const intro of introductions) {
		// Currency clues
		if (currencyPlaces.includes(place)) {
			for (const clue of currencyClues) {
				clues.push(`${intro} ${suspect.pronouns.subject} ${clue}.`);
			}
		}

		// Topic clues
		if (topicPlaces.includes(place)) {
			for (const clue of topicClues) {
				atlas.topics.forEach((topic) => {
					clues.push(`${intro} ${suspect.pronouns.subject} ${clue} ${topic}.`);
				});
			}
		}

		// Plane clues
		if (place === Place.AIRPORT) {
			for (const clue of planeClues) {
				clues.push(`${intro} ${suspect.pronouns.subject} ${clue}.`);
			}
		}

		// Ship clues
		if (shipPlaces.includes(place)) {
			for (const clue of shipClues) {
				clues.push(`${intro} ${suspect.pronouns.subject} ${clue}.`);
			}
		}

		// General clues
		for (const clue of placeClues) {
			atlas.places.forEach((place) => {
				clues.push(`${intro} ${suspect.pronouns.subject} ${clue} ${place}.`);
			});
		}

		for (const clue of objectClues) {
			atlas.objects.forEach((object) => {
				clues.push(`${intro} ${suspect.pronouns.subject} ${clue} ${object}.`);
			});
		}

		for (const clue of languageClues) {
			clues.push(`${intro} ${suspect.pronouns.subject} ${clue}.`);
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
