import { browser } from '$app/environment';
import { ATLASES, getRandomAtlas, type Atlas } from '$lib/atlases';
import { getRandomValue } from './helpers';
import { getRounds, type Round } from './rounds';
import { SUSPECTS, type Suspect } from './suspects';
import { writable } from 'svelte/store';

interface Game {
	stolenTreasure: string;
	suspect: Suspect;
	rounds: Round[];
	currentRoundIndex: number;
}

const atlasesInRound = [...ATLASES];
const startingDestination: Atlas = getRandomAtlas();
const suspect = getRandomValue(SUSPECTS);

export function generateGame(): Game {
	return {
		stolenTreasure: getRandomValue(startingDestination.objects),
		suspect,
		rounds: getRounds(startingDestination, atlasesInRound, suspect),
		currentRoundIndex: 0
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
