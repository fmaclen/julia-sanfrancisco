import { browser } from '$app/environment';
import type { TranslationFunctions } from '$i18n/i18n-types';
import { getRandomValue } from '$lib/helpers';
import { writable } from 'svelte/store';
import type { LocalizedString } from 'typesafe-i18n';

enum Place {
	AIRPORT,
	BANK,
	FOREIGN_MINISTRY,
	HARBOR,
	HOTEL,
	LIBRARY,
	MARKETPLACE,
	MUSEUM,
	PALACE,
	RIVERFRONT,
	SPORT_CLUB,
	STOCK_EXCHANGE
}

enum Witness {
	// Airport
	BAGGAGE_CLERK,
	FLIGHT_ATTENDANT,
	PILOT,

	// Bank
	BANK_GUARD,
	TELLER,
	VICE_PRESIDENT,

	// Foreign Ministry
	AMBASSADOR,
	ATTACHE,
	UNDER_SECRETARY,

	// Harbor
	CUSTOMS_OFFICER,
	HARBOR_MASTER,
	SAILOR,

	// Hotel
	BELLHOP,
	HOUSE_DETECTIVE,
	HOTEL_MANAGER,

	// Library
	ARCHIVIST,
	CIRCULATION_CLERK,
	REFERENCE_LIBRARIAN,

	// Marketplace
	HAWKER,
	STREET_MERCHANT,
	URCHIN,

	// Museum
	CURATOR,
	DOCENT,
	MUSEUM_GUARD,

	// Palace
	PALACE_GUARD,
	PRIVY_COUNCILLOR,
	SOLDIER,

	// Riverfront
	SAILORS_PARROT,
	STEVEDORE,
	TUGBOAT_CAPTAIN,

	// Sport Club
	BARTENDER,
	TENNIS_PRO,
	WAITER,

	// Stock Exchange
	ANALYST,
	MESSENGER,
	TRADER
}

interface Scene {
	place: string;
	witness: string;
	clue: string;
}

export interface Atlas {
	city: string;
	descriptions: string[];
	currency: string;
	language: string;
	flag: string;
	leader: string;
	sights: string[];
	objects: string[];
	topics: string[];
}

export interface Round {
	atlas: Atlas;
	scenes: Scene[];
	destinations: Atlas[]; // Would have used a Set<Atlas>, but we can't save that object type to localStorage
}

interface Suspect {
	name: string;
	hobby: string;
	hair: string;
	feature: string;
	vehicle: string;
	sex: string;
}

export interface Game {
	currentRoundIndex: number;
	currentTime: Date | null;
	roundDecoy: Round | null;
	rounds: Round[];
	stolenTreasure: string;
	suspect: Suspect;
}

export function generateGame(LL: TranslationFunctions): Game {
	const suspect = getLocalizedSuspects(LL);
	const rounds = generateRounds(LL, suspect);
	const firstRound = rounds[0];

	return {
		currentRoundIndex: 0,
		currentTime: null,
		roundDecoy: null,
		rounds,
		stolenTreasure: getRandomValue(firstRound.atlas.objects),
		suspect
	};
}

interface LocalizedPlace {
	place: Place;
	name: string;
}

interface LocalizedWitness {
	witness: Witness;
	name: string;
}

function generateRounds(LL: TranslationFunctions, suspect: Suspect): Round[] {
	const NUMBER_OF_ROUNDS = 6;

	const atlases = getLocalizedAtlases(LL);
	const roundAtlases: Atlas[] = [];

	// Get unique atlases that the thief will follow in each round
	for (let i = 0; i < NUMBER_OF_ROUNDS; i++) {
		let atlasInRound = getRandomValue(atlases);

		// Prevent duplicate atlas in rounds
		while (roundAtlases.includes(atlasInRound)) atlasInRound = getRandomValue(atlases);
		roundAtlases.push(atlasInRound);

		// Remove the atlas from the list so it can't be used again
		atlases.splice(atlases.indexOf(atlasInRound), 1);
	}

	// Generate the scenes, clues and decoys for each round
	const rounds: Round[] = [];
	for (const roundAtlas of roundAtlases) {
		const previousRoundAtlas = roundAtlases[roundAtlases.indexOf(roundAtlas) - 1];
		const nextRoundAtlas = roundAtlases[roundAtlases.indexOf(roundAtlas) + 1];
		const isRoundFinal = !nextRoundAtlas;

		const destinations: Set<Atlas> = new Set();
		if (previousRoundAtlas) destinations.add(previousRoundAtlas);
		if (nextRoundAtlas) destinations.add(nextRoundAtlas);

		setDecoyDestinations(destinations, roundAtlas, atlases);

		rounds.push({
			atlas: roundAtlas,
			destinations: Array.from(destinations),
			scenes: generateScenes({ LL, nextRoundAtlas, suspect, isRoundFinal })
		});
	}

	return rounds;
}

////////////////////////////////////////////////////////////////////////////////

export function generateDecoyRound(
	LL: TranslationFunctions,
	currentAtlas: Atlas,
	anchorAtlas: Atlas
): Round {
	const atlases = getLocalizedAtlases(LL);
	const destinations = new Set<Atlas>();

	// Make sure the user can come back to where the suspect was last seen
	destinations.add(anchorAtlas);

	// Fill out the rest destinations with random ones
	setDecoyDestinations(destinations, currentAtlas, atlases);

	return {
		atlas: currentAtlas,
		destinations: Array.from(destinations),
		scenes: generateScenes({ LL, isRoundDecoy: true })
	};
}

////////////////////////////////////////////////////////////////////////////////

interface ScenesParams {
	LL: TranslationFunctions;
	nextRoundAtlas?: Atlas;
	suspect?: Suspect;
	isRoundFinal?: boolean;
	isRoundDecoy?: boolean;
}

function generateScenes(params: ScenesParams): Scene[] {
	const NUMBER_OF_SCENES = 3;

	const { LL } = params;

	const scenes: Scene[] = [];
	const places = getLocalizedPlaces(LL);
	const placesSet = new Set<LocalizedPlace>();
	const cluesSet = new Set<string>();

	while (placesSet.size < NUMBER_OF_SCENES) {
		placesSet.add(getRandomValue(places));
	}

	for (let i = 0; i < NUMBER_OF_SCENES; i++) {
		const { nextRoundAtlas, suspect, isRoundFinal, isRoundDecoy } = params;

		const place = Array.from(placesSet)[i];

		let sceneClues: string[] = [];
		if (isRoundFinal) sceneClues = getLocalizedFinalRoundClues(LL);
		if (isRoundDecoy) sceneClues = getLocalizedDecoyClues(LL);
		if (nextRoundAtlas && suspect) sceneClues = generateClues(params, place);

		while (cluesSet.size < i + 1) {
			cluesSet.add(getRandomValue(sceneClues));
		}

		const clue = Array.from(cluesSet)[i];
		const witness = getLocalizedWitnesses(LL, place.place);

		scenes.push({
			clue,
			place: place.name,
			witness: witness.name
		});
	}

	return scenes;
}

////////////////////////////////////////////////////////////////////////////////

function generateClues(params: ScenesParams, place: LocalizedPlace): string[] {
	const { LL } = params;
	const clues: string[] = [];

	const currencyPlaces = [Place.BANK, Place.STOCK_EXCHANGE, Place.HOTEL, Place.AIRPORT];
	const topicPlaces = [Place.MUSEUM, Place.LIBRARY];
	const shipPlaces = [Place.HARBOR, Place.RIVERFRONT];

	const introductions = getLocalizedClues('introduction');
	const sightClues = getLocalizedClues('sight');
	const objectClues = getLocalizedClues('object');
	const topicClues = getLocalizedClues('topic');
	const currencyClues = getLocalizedClues('currency');
	const languageClues = getLocalizedClues('language');
	const planeClues = getLocalizedClues('plane');
	const shipClues = getLocalizedClues('ship');

	function getLocalizedClues(
		type:
			| 'introduction'
			| 'sight'
			| 'language'
			| 'currency'
			| 'object'
			| 'topic'
			| 'plane'
			| 'ship'
			| 'finalRound'
			| 'decoy'
	): string[] {
		const clueKeys = Object.keys(LL.clues[type]);

		// All wildcards must be lowercase
		const wildcards = {
			currency: params.nextRoundAtlas?.currency.toLowerCase(),
			language: params.nextRoundAtlas?.language.toLowerCase(),
			flag: params.nextRoundAtlas?.flag.toLowerCase(),
			sex: params.suspect?.sex.toLowerCase()
		};

		const localizedClues: string[] = [];

		for (let i = 0; i < clueKeys.length; i++) {
			const clueKey = i.toString();
			const clue = (LL.clues[type] as Record<string, (_: any) => LocalizedString>)[clueKey](
				wildcards
			);
			localizedClues.push(clue);
		}

		return localizedClues;
	}

	for (const intro of introductions) {
		// Currency clues
		if (currencyPlaces.includes(place.place)) {
			for (const clue of currencyClues) {
				clues.push(`${intro} ${clue}.`);
			}
		}

		// Topic clues
		if (topicPlaces.includes(place.place)) {
			for (const clue of topicClues) {
				clues.push(`${intro} ${clue}.`);
			}
		}

		// Plane clues
		if (place.place === Place.AIRPORT) {
			for (const clue of planeClues) {
				clues.push(`${intro} ${clue}.`);
			}
		}

		// Ship clues
		if (shipPlaces.includes(place.place)) {
			for (const clue of shipClues) {
				clues.push(`${intro} ${clue}.`);
			}
		}

		// No-place specific clues
		for (const clue of sightClues) {
			params.nextRoundAtlas?.sights.forEach((place) => {
				clues.push(`${intro} ${clue} ${place}.`);
			});
		}

		for (const clue of objectClues) {
			params.nextRoundAtlas?.objects.forEach((object) => {
				clues.push(`${intro} ${clue} ${object}.`);
			});
		}

		for (const clue of languageClues) {
			clues.push(`${intro} ${clue}.`);
		}
	}

	return clues;
}

////////////////////////////////////////////////////////////////////////////////

function setDecoyDestinations(
	destinations: Set<Atlas>,
	currentAtlas: Atlas,
	atlases: Atlas[]
): void {
	const MAX_DECOYS = 5;

	while (destinations.size < MAX_DECOYS) {
		const randomAtlas = getRandomValue(atlases);

		// Do not add the current city as a possible destination
		if (randomAtlas.city !== currentAtlas.city) destinations.add(randomAtlas);
	}
}

function getLocalizedSuspects(LL: TranslationFunctions): Suspect {
	const suspectIndexes = Object.keys(LL.suspects);
	const suspects: Suspect[] = [];

	for (const suspectIndex of suspectIndexes) {
		const validatedSuspectIndex = suspectIndex as keyof typeof LL.suspects;

		suspects.push({
			name: LL.suspects[validatedSuspectIndex].name(),
			hobby: LL.suspects[validatedSuspectIndex].hobby(),
			hair: LL.suspects[validatedSuspectIndex].hair(),
			feature: LL.suspects[validatedSuspectIndex].feature(),
			vehicle: LL.suspects[validatedSuspectIndex].vehicle(),
			sex: LL.suspects[validatedSuspectIndex].sex()
		});
	}

	return getRandomValue(suspects);
}

function getLocalizedAtlases(LL: TranslationFunctions): Atlas[] {
	const atlaseKeys = Object.keys(LL.atlases);
	const atlases: Atlas[] = [];

	for (const atlasKey of atlaseKeys) {
		const validKey = atlasKey as keyof typeof LL.atlases;

		atlases.push({
			city: LL.atlases[validKey].city(),
			descriptions: getTranslationFromArray(LL.atlases[validKey].descriptions),
			currency: LL.atlases[validKey].currency(),
			language: LL.atlases[validKey].language(),
			flag: LL.atlases[validKey].flag(),
			leader: LL.atlases[validKey].leader(),
			sights: getTranslationFromArray(LL.atlases[validKey].sights),
			objects: getTranslationFromArray(LL.atlases[validKey].objects),
			topics: getTranslationFromArray(LL.atlases[validKey].topics)
		});
	}

	return atlases;
}

function getLocalizedPlaces(LL: TranslationFunctions): LocalizedPlace[] {
	const placeKeys = Object.keys(LL.scenes.places);
	const places: LocalizedPlace[] = [];

	for (const placeKey of placeKeys) {
		const validKey = placeKey as keyof typeof LL.scenes.places;
		const placeIndex = placeKey as keyof typeof Place;
		places.push({ place: Place[placeIndex], name: LL.scenes.places[validKey]() });
	}

	return places;
}

function getLocalizedWitnesses(LL: TranslationFunctions, place: Place): LocalizedWitness {
	let possibleWitnesses: Witness[];

	switch (place) {
		case Place.AIRPORT:
			possibleWitnesses = [Witness.BAGGAGE_CLERK, Witness.FLIGHT_ATTENDANT, Witness.PILOT];
			break;
		case Place.BANK:
			possibleWitnesses = [Witness.BANK_GUARD, Witness.TELLER, Witness.VICE_PRESIDENT];
			break;
		case Place.FOREIGN_MINISTRY:
			possibleWitnesses = [Witness.AMBASSADOR, Witness.ATTACHE, Witness.UNDER_SECRETARY];
			break;
		case Place.HARBOR:
			possibleWitnesses = [Witness.CUSTOMS_OFFICER, Witness.HARBOR_MASTER, Witness.SAILOR];
			break;
		case Place.HOTEL:
			possibleWitnesses = [Witness.BELLHOP, Witness.HOUSE_DETECTIVE, Witness.HOTEL_MANAGER];
			break;
		case Place.LIBRARY:
			possibleWitnesses = [
				Witness.ARCHIVIST,
				Witness.CIRCULATION_CLERK,
				Witness.REFERENCE_LIBRARIAN
			];
			break;
		case Place.MARKETPLACE:
			possibleWitnesses = [Witness.HAWKER, Witness.STREET_MERCHANT, Witness.URCHIN];
			break;
		case Place.MUSEUM:
			possibleWitnesses = [Witness.CURATOR, Witness.DOCENT, Witness.MUSEUM_GUARD];
			break;
		case Place.PALACE:
			possibleWitnesses = [Witness.PALACE_GUARD, Witness.PRIVY_COUNCILLOR, Witness.SOLDIER];
			break;
		case Place.RIVERFRONT:
			possibleWitnesses = [Witness.SAILORS_PARROT, Witness.STEVEDORE, Witness.TUGBOAT_CAPTAIN];
			break;
		case Place.SPORT_CLUB:
			possibleWitnesses = [Witness.BARTENDER, Witness.TENNIS_PRO, Witness.WAITER];
			break;
		case Place.STOCK_EXCHANGE:
		default:
			possibleWitnesses = [Witness.ANALYST, Witness.MESSENGER, Witness.TRADER];
	}

	const witnessKeys = Object.keys(LL.scenes.witnesses);
	const witnessesInPlace: LocalizedWitness[] = [];

	for (const witnessKey of witnessKeys) {
		const validKey = witnessKey as keyof typeof LL.scenes.witnesses;
		const witnessIndex = witnessKey as keyof typeof Witness;
		const witness = Witness[witnessIndex];

		if (possibleWitnesses.map((key) => Witness[key]).includes(witness.toString())) {
			witnessesInPlace.push({ witness, name: LL.scenes.witnesses[validKey]() });
		}
	}

	return getRandomValue(witnessesInPlace);
}

function getLocalizedFinalRoundClues(LL: TranslationFunctions): string[] {
	const finalRoundKeys = Object.keys(LL.clues.finalRound);
	const finalRoundClues: string[] = [];

	for (const finalRoundKey of finalRoundKeys) {
		const validKey = finalRoundKey as keyof typeof LL.clues.finalRound;
		finalRoundClues.push(LL.clues.finalRound[validKey]());
	}

	return finalRoundClues;
}

function getLocalizedDecoyClues(LL: TranslationFunctions): string[] {
	const decoyKeys = Object.keys(LL.clues.decoy);
	const decoyClues: string[] = [];

	for (const decoyKey of decoyKeys) {
		const validKey = decoyKey as keyof typeof LL.clues.decoy;
		decoyClues.push(LL.clues.decoy[validKey]());
	}

	return decoyClues;
}

type LocalizedArray = {
	[key: string]: () => LocalizedString;
};

function getTranslationFromArray(localizedArray: LocalizedArray): string[] {
	const newArray: string[] = [];

	const objectCount = Object.values(localizedArray).length;
	for (let i = 0; i < objectCount; i++) {
		newArray.push(Object.values(localizedArray)[i]());
	}

	return newArray;
}

////////////////////////////////////////////////////////////////////////////////

const gameLocalStorage: string | null = browser ? window.localStorage.getItem('game') : null;

let game: Game | null = null;
export const gameStore = writable<Game | null>(null);

// Read existing game from localStorage
if (gameLocalStorage) {
	game = JSON.parse(gameLocalStorage) as Game;
	gameStore.set(game);
}

// Write game to localStorage
gameStore.subscribe((value) => {
	if (browser) {
		window.localStorage.setItem('game', JSON.stringify(value));
	}
});
