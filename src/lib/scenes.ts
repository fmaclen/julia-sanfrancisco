import type { Atlas } from './atlases';
import { FINAL_ROUND_CLUES, generateClues, getDecoyClues } from './clues';
import { getRandomValue } from './helpers';
import type { Suspect } from './suspects';

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
	isRoundDecoy,
	suspect
}: {
	nextRoundAtlas?: Atlas;
	isRoundFinal?: boolean;
	isRoundDecoy?: boolean;
	suspect?: Suspect;
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
		if (isRoundFinal) sceneClues = FINAL_ROUND_CLUES;
		if (isRoundDecoy) sceneClues = getDecoyClues(place);
		if (nextRoundAtlas && suspect)
			sceneClues = generateClues({ atlas: nextRoundAtlas, place, suspect });

		while (clues.size < i + 1) {
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
