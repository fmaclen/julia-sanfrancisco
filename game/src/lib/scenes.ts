import type { Atlas } from './atlases';
import { getRandomValue } from './helpers';

export enum Place {
	AIRPORT = 'Airport',
	BANK = 'Bank',
	FOREIGN_MINISTRY = 'Foreign Ministry',
	HARBOR = 'Harbor',
	HOTEL = 'Hotel',
	LIBRARY = 'Library',
	MARKETPLACE = 'Marketplace',
	MUSEUM = 'Museum',
	PALACE = 'Palace',
	RIVERFRONT = 'Riverfront',
	SPORT_CLUB = 'Sport Club',
	STOCK_EXCHANGE = 'Stock Exchange'
}

export enum Witness {
	// Airport
	BAGGAGE_CLERK = 'Baggage clerk',
	FLIGHT_ATTENDANT = 'Flight attendant',
	PILOT = 'Pilot',

	// Bank
	BANK_GUARD = 'Bank guard',
	TELLER = 'Teller',
	VICE_PRESIDENT = 'Vice president',

	// Foreign Ministry
	AMBASSADOR = 'Ambassador',
	ATTACHE = 'Attache',
	UNDER_SECRETARY = 'Under Secretary',

	// Harbor
	CUSTOMS_OFFICER = 'Customs officer',
	HARBOR_MASTER = 'Harbor Master',
	SAILOR = 'Sailor',

	// Hotel
	BELLHOP = 'Bellhop',
	HOUSE_DETECTIVE = 'House detective',
	HOTEL_MANAGER = 'Hotel manager',

	// Library
	ARCHIVIST = 'Archivist',
	CIRCULATION_CLERK = 'Circulation clerk',
	REFERENCE_LIBRARIAN = 'Reference librarian',

	// Marketplace
	HAWKER = 'Hawker',
	STREET_MERCHANT = 'Street Merchant',
	URCHIN = 'Urchin',

	// Museum
	CURATOR = 'Curator',
	DOCENT = 'Docent',
	MUSEUM_GUARD = 'Museum guard',

	// Palace
	PALACE_GUARD = 'Palace guard',
	PRIVY_COUNCILLOR = 'Privy Councillor',
	SOLDIER = 'Soldier',

	// Riverfront
	SAILORS_PARROT = "Sailor's parrot",
	STEVEDORE = 'Stevedore',
	TUGBOAT_CAPTAIN = 'Tugboat captain',

	// Sport Club
	BARTENDER = 'Bartender',
	TENNIS_PRO = 'Tennis pro',
	WAITER = 'Waiter',

	// Stock Exchange
	ANALYST = 'Analyst',
	MESSENGER = 'Messenger',
	TRADER = 'Trader'
}

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
	const NUMBER_OF_SCENES = 3;

	const scenes: Scene[] = [];
	const places = new Set<Place>();
	const clues = new Set<string>();

	while (places.size <= NUMBER_OF_SCENES) {
		places.add(getRandomPlace());
	}

	for (let i = 0; i < NUMBER_OF_SCENES; i++) {
		const place = Array.from(places)[i];

		let sceneClues: string[] = [];
		if (isRoundFinal) sceneClues = getFinalClues();
		if (isRoundDecoy) sceneClues = getDecoyClues(place);
		if (nextRoundAtlas) sceneClues = getNextRoundClues(nextRoundAtlas);

		while (clues.size < NUMBER_OF_SCENES) {
			clues.add(getRandomValue(sceneClues));
		}

		scenes.push({
			place,
			witness: getWitnes(place),
			clue: Array.from(clues)[i]
		});
	}

	return scenes;
}

function getFinalClues(): string[] {
	return [
		"The word is out, you're getting too close gumshoe...",
		'Rumor has it that the gang is in town somewhere.',
		'All I know is that something suspicious is happening in town.',
		'The only thing I can tell you is to watch your step.'
	];
}

function getDecoyClues(place: string): string[] {
	return [
		"Didn't see anyone matching that description.",
		`Sorry, I haven't noticed anything suspicious around the ${place}.`,
		"Sorry, I haven't seen anybody like that around here.",
		"Sorry, I haven't seen anyone like that around here."
	];
}

function getNextRoundClues(nextRoundAtlas: Atlas): string[] {
	return [
		`Yup, saw them leave on a plane with ${nextRoundAtlas.flag} on the tail.`,
		`He wanted to study ${getRandomValue(nextRoundAtlas.study)}.`,
		`He was talking about seeing ${getRandomValue(nextRoundAtlas.see)}.`,
		`He asked about changing his money to $${nextRoundAtlas.currency}.`
	];
}

function getRandomPlace(): Place {
	const placesArray = Object.values(Place);
	return getRandomValue(placesArray);
}

function getWitnes(place: Place): Witness {
	switch (place) {
		case Place.AIRPORT:
			return getRandomValue([Witness.BAGGAGE_CLERK, Witness.FLIGHT_ATTENDANT, Witness.PILOT]);
		case Place.BANK:
			return getRandomValue([Witness.BANK_GUARD, Witness.TELLER, Witness.VICE_PRESIDENT]);
		case Place.FOREIGN_MINISTRY:
			return getRandomValue([Witness.AMBASSADOR, Witness.ATTACHE, Witness.UNDER_SECRETARY]);
		case Place.HARBOR:
			return getRandomValue([Witness.CUSTOMS_OFFICER, Witness.HARBOR_MASTER, Witness.SAILOR]);
		case Place.HOTEL:
			return getRandomValue([Witness.BELLHOP, Witness.HOUSE_DETECTIVE, Witness.HOTEL_MANAGER]);
		case Place.LIBRARY:
			return getRandomValue([
				Witness.ARCHIVIST,
				Witness.CIRCULATION_CLERK,
				Witness.REFERENCE_LIBRARIAN
			]);
		case Place.MARKETPLACE:
			return getRandomValue([Witness.HAWKER, Witness.STREET_MERCHANT, Witness.URCHIN]);
		case Place.MUSEUM:
			return getRandomValue([Witness.CURATOR, Witness.DOCENT, Witness.MUSEUM_GUARD]);
		case Place.PALACE:
			return getRandomValue([Witness.PALACE_GUARD, Witness.PRIVY_COUNCILLOR, Witness.SOLDIER]);
		case Place.RIVERFRONT:
			return getRandomValue([Witness.SAILORS_PARROT, Witness.STEVEDORE, Witness.TUGBOAT_CAPTAIN]);
		case Place.SPORT_CLUB:
			return getRandomValue([Witness.BARTENDER, Witness.TENNIS_PRO, Witness.WAITER]);
		case Place.STOCK_EXCHANGE:
		default:
			return getRandomValue([Witness.ANALYST, Witness.MESSENGER, Witness.TRADER]);
	}
}
