import { browser } from '$app/environment';
import en from '$i18n/en';
import type { Locales, Translation, TranslationFunctions } from '$i18n/i18n-types';
import { getArtworkPath, getRandomValue } from '$lib/helpers';
import { getSuspectWarrantKeys, Suspect, type WarrantKeys } from './suspects';
import { format } from 'date-fns';
import { enUS, es } from 'date-fns/locale';
import { writable } from 'svelte/store';
import type { LocalizedString } from 'typesafe-i18n';

export const SUSPECT_TRAIL_SCENE_DURATION = 4000;

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
	place: LocalizedPlace;
	witness: string;
	clue: string;
	suspectClue?: string;
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
	artwork: string;
}

export interface Round {
	atlas: Atlas;
	scenes: Scene[];
	destinations: Atlas[]; // Would have used a Set<Atlas>, but we can't save that object type to localStorage
}

interface LocalizedSuspect {
	key: Suspect;
	name: string;
	hobby: string;
	hair: string;
	feature: string;
	vehicle: string;
	clues: string[];
	warrantKeys: WarrantKeys;
	lastRoundHidingPlace: number;
	caught: boolean;
}

export interface Game {
	currentRoundIndex: number;
	currentTime: Date | null;
	roundDecoy: Round | null;
	rounds: Round[];
	stolenTreasure: string;
	suspect: LocalizedSuspect;
	warrants: Suspect[];
}

export function generateGame(LL: TranslationFunctions): Game {
	const suspect = getLocalizedSuspects(LL);
	const rounds = generateRounds(LL, suspect);
	const firstRound = rounds[0];

	return {
		currentRoundIndex: 0,
		currentTime: null,
		roundDecoy: null,
		warrants: [],
		rounds,
		suspect,
		stolenTreasure: getRandomValue(firstRound.atlas.objects)
	};
}

interface LocalizedPlace {
	place: Place;
	name: string;
	artwork: string;
}

interface LocalizedWitness {
	witness: Witness;
	name: string;
}

function generateRounds(LL: TranslationFunctions, suspect: LocalizedSuspect): Round[] {
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
	suspect?: LocalizedSuspect;
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
		let suspectClue: string | undefined = undefined;

		// We don't want to always include a suspect clue
		if (!isRoundFinal && !isRoundDecoy && suspect) {
			const ODDS_OF_NO_CLUE = 10;
			const possibleSuspectClues: (string | undefined)[] = [...suspect.clues];

			// We fill the array with `undefined` values to increase the odds of not having a clue
			for (let i = 0; i < ODDS_OF_NO_CLUE; i++) {
				possibleSuspectClues.push(undefined);
			}

			suspectClue = getRandomValue(possibleSuspectClues);
		}

		scenes.push({
			clue,
			suspectClue,
			place: place,
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
			sex: params.suspect?.warrantKeys.sex
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

function getLocalizedSuspects(LL: TranslationFunctions): LocalizedSuspect {
	const suspects: Suspect[] = Object.values(Suspect);
	const suspect = getRandomValue(suspects);
	const translationKey = suspect as keyof Translation['suspects'];

	const localizedSuspect: LocalizedSuspect = {
		key: suspect,
		name: LL.suspects[translationKey].name(),
		hobby: LL.suspects[translationKey].hobby(),
		hair: LL.suspects[translationKey].hair(),
		feature: LL.suspects[translationKey].feature(),
		vehicle: LL.suspects[translationKey].vehicle(),
		clues: getTranslationFromArray(LL.suspects[translationKey].clues),
		warrantKeys: getSuspectWarrantKeys(suspect),
		lastRoundHidingPlace: getRandomValue([0, 1, 2]), // Pick a random place to hide for the last round
		caught: false
	};

	return localizedSuspect;
}

////////////////////////////////////////////////////////////////////////////////

function getLocalizedAtlases(LL: TranslationFunctions): Atlas[] {
	const atlaseKeys = Object.keys(LL.atlases);
	const atlases: Atlas[] = [];

	for (const atlasKey of atlaseKeys) {
		const translationKey = atlasKey as keyof Translation['atlases'];

		atlases.push({
			city: LL.atlases[translationKey].city(),
			descriptions: getTranslationFromArray(LL.atlases[translationKey].descriptions),
			currency: LL.atlases[translationKey].currency(),
			language: LL.atlases[translationKey].language(),
			flag: LL.atlases[translationKey].flag(),
			leader: LL.atlases[translationKey].leader(),
			sights: getTranslationFromArray(LL.atlases[translationKey].sights),
			objects: getTranslationFromArray(LL.atlases[translationKey].objects),
			topics: getTranslationFromArray(LL.atlases[translationKey].topics),

			// HACK: We are using the English name of the `city` to get the artwork.
			artwork: getArtworkPath(en.atlases[translationKey].city, 'atlas')
		});
	}

	return atlases;
}

function getLocalizedPlaces(LL: TranslationFunctions): LocalizedPlace[] {
	const placeKeys = Object.keys(LL.scenes.places);
	const places: LocalizedPlace[] = [];

	for (const placeKey of placeKeys) {
		const translationKey = placeKey as keyof Translation['scenes']['places'];

		places.push({
			place: parseInt(placeKey),
			name: LL.scenes.places[translationKey](),

			// HACK: We are using the English name of the `place` to get the artwork.
			artwork: getArtworkPath(en.scenes.places[translationKey], 'places')
		});
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
			possibleWitnesses = [Witness.ANALYST, Witness.MESSENGER, Witness.TRADER];
			break;
		default:
			possibleWitnesses = [];
	}

	if (possibleWitnesses.length === 0) throw new Error('No witnesses found for this place.');

	const witnessKeys = Object.keys(LL.scenes.witnesses);
	const witnessesInPlace: LocalizedWitness[] = [];

	for (const witnessKey of witnessKeys) {
		const translationKey = witnessKey as keyof Translation['scenes']['witnesses'];
		const witnessIndex = witnessKey as keyof typeof Witness;
		const witness = Witness[witnessIndex];

		if (possibleWitnesses.map((key) => Witness[key]).includes(witness.toString())) {
			witnessesInPlace.push({ witness, name: LL.scenes.witnesses[translationKey]() });
		}
	}

	return getRandomValue(witnessesInPlace);
}

function getLocalizedFinalRoundClues(LL: TranslationFunctions): string[] {
	const finalRoundKeys = Object.keys(LL.clues.finalRound);
	const finalRoundClues: string[] = [];

	for (const finalRoundKey of finalRoundKeys) {
		const translationKey = finalRoundKey as keyof Translation['clues']['finalRound'];
		finalRoundClues.push(LL.clues.finalRound[translationKey]());
	}

	return finalRoundClues;
}

function getLocalizedDecoyClues(LL: TranslationFunctions): string[] {
	const decoyKeys = Object.keys(LL.clues.decoy);
	const decoyClues: string[] = [];

	for (const decoyKey of decoyKeys) {
		const translationKey = decoyKey as keyof Translation['clues']['decoy'];
		decoyClues.push(LL.clues.decoy[translationKey]());
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

export function getFormattedTime(time: Date, locale: Locales): string {
	// Format the time as "Monday 9:00 am" / "Lunes 9:00 am"
	const formattedTime = format(time, 'EEEE h:mm aaa', { locale: locale === 'en' ? enUS : es });

	// Capitalize the first letter
	return formattedTime.charAt(0).toUpperCase() + formattedTime.slice(1);
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
