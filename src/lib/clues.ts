import type { Atlas } from '$lib/atlases';
import { getRandomValue } from '$lib/helpers';
import { Place } from '$lib/scenes';
import type { Suspect } from '$lib/suspects';

interface CluesBrief {
	atlas: Atlas;
	suspect: Suspect;
	place: Place;
}

export const FINAL_ROUND_CLUES = [
	"The word is out, you're getting too close gumshoe...",
	'Rumor has it that the gang is in town somewhere.',
	'All I know is that something suspicious is happening in town.',
	'The only thing I can tell you is to watch your step.'
];

const INTRODUCTION_CLUES = [
	'All I know is that',
	"I saw the person you're looking for and",
	'A suspicious person was here and',
	'A reliable source told me',
	'Sources tell me',
	'My sources tell me',
	'The person you are looking for was here and',
	'I heard'
];

const SEE_CLUES = [
	'asked for a map to',
	'asked many questions about',
	'planned to explore',
	'was interested in photographing',
	'wanted to see',
	'was heading to'
];

const TO_DO_CLUES = [
	'planned to',
	'wanted to',
	'mentioned wanting to',
	'asked for tips on how to',
	'was going to',
	'had an urge to'
];

const STUDY_CLUES = [
	'was researching',
	'asked about',
	'asked many questions about',
	'was interested in',
	'wanted to know about',
	'had a book on'
];

const TRADE_CLUES = [
	'asked where to find the best collection of',
	'mentioned having to aquire',
	'had the need to trade',
	'wanted to buy',
	'wanted to sell'
];

export function generateClues(cluesBrief: CluesBrief): string[] {
	const { atlas, suspect, place } = cluesBrief;
	const { subjectPronoun, possesivePronoun } = suspect;

	let clues: string[] = [
		// See
		`${getRandomValue(INTRODUCTION_CLUES)}
    ${subjectPronoun}
    ${getRandomValue(SEE_CLUES)}
    ${getRandomValue(atlas.see)}.`,

		// To do
		`${getRandomValue(INTRODUCTION_CLUES)}
    ${subjectPronoun}
    ${getRandomValue(TO_DO_CLUES)}
    ${getRandomValue(atlas.toDo)}.`,

		`${getRandomValue(INTRODUCTION_CLUES)}
    ${subjectPronoun}
    ${getRandomValue(TO_DO_CLUES)}
    ${getRandomValue(atlas.toDo)} with the ${atlas.leader}.`,

		// Trade
		`${getRandomValue(INTRODUCTION_CLUES)}
    ${subjectPronoun}
    ${getRandomValue(TRADE_CLUES)}
    ${getRandomValue(atlas.trade)}.`,

		// Dictionary
		`${getRandomValue(INTRODUCTION_CLUES)}
    ${subjectPronoun} had
    ${atlas.language} in
    ${possesivePronoun} pocket.`,

		`${getRandomValue(INTRODUCTION_CLUES)}
    ${subjectPronoun} was carrying a
    ${atlas.language} phrase book.`,

		// Currency
		`${getRandomValue(INTRODUCTION_CLUES)}
    ${subjectPronoun} asked about the exhcnage rate for
    $${atlas.currency}.`,

		`${getRandomValue(INTRODUCTION_CLUES)}
    ${subjectPronoun} changed ${possesivePronoun} money to
    $${atlas.currency}.`
	];

	switch (place) {
		case Place.AIRPORT:
			clues = [
				...clues,
				`${getRandomValue(INTRODUCTION_CLUES)}
        ${subjectPronoun} was in a rush to catch a plane with ${atlas.flag} flag on it's wing.`,
				`${getRandomValue(INTRODUCTION_CLUES)}
        ${subjectPronoun} flew away on a plane with ${atlas.flag} flag on it's tail.`,
				`${getRandomValue(INTRODUCTION_CLUES)}
        ${subjectPronoun} left on plane with ${atlas.language} words on it's livery.`
			];
			break;

		case Place.HARBOR:
			clues = [
				...clues,
				`${getRandomValue(INTRODUCTION_CLUES)}
        ${subjectPronoun} sailed away on a ship flying a ${atlas.flag} flag.`,
			];
			break;

		case Place.LIBRARY:
		case Place.MUSEUM:
			clues = [
				...clues,
				`${getRandomValue(INTRODUCTION_CLUES)}
        ${subjectPronoun}
        ${getRandomValue(STUDY_CLUES)}
        ${getRandomValue(atlas.study)}.`
			];
			break;

		default:
			break;
	}

	return clues;
}

export function getDecoyClues(place: string): string[] {
	return [
		"Didn't see anyone matching that description.",
		`Sorry, I haven't noticed anything suspicious around the ${place}.`,
		"Sorry, I haven't seen anybody like that around here.",
		"Sorry, I haven't seen anyone like that around here."
	];
}
