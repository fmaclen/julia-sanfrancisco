import { browser } from '$app/environment';
import { ATLASES, getRandomAtlas, type Atlas } from '$lib/atlases';
import { getRandomValue } from './helpers';
import { getRounds, type Round } from './rounds';
import { SUSPECTS, type Suspect } from './suspects';
import { writable } from 'svelte/store';

export interface Game {
	currentRoundIndex: number;
	currentTime: Date | null;
	roundDecoy: Round | null;
	rounds: Round[];
	stolenTreasure: string;
	suspect: Suspect;
}

const atlasesInRound = [...ATLASES];
const startingDestination: Atlas = getRandomAtlas();
const suspect = getRandomValue(SUSPECTS);

export function generateGame(): Game {
	return {
		currentRoundIndex: 0,
		currentTime: null,
		roundDecoy: null,
		rounds: getRounds(startingDestination, atlasesInRound, suspect),
		stolenTreasure: getRandomValue(startingDestination.objects),
		suspect
	};
}

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
