import { browser } from '$app/environment';
import { writable } from 'svelte/store';

export interface Player {
	name: string;
	score: number;
}

export enum Rank {
	ROOKIE = 'Rookie', // 0 cases
	SLEUTH = 'Sleuth', // 1-3 cases
	PRIVATE_EYE = 'Private eye', // 4-6 cases
	INVESTIGATOR = 'Investigator', // 7-9 cases
	ACE_DETECTIVE = 'Ace detective', // 10-13 cases
	SUPER_SLEUTH = 'Super sleuth' // 14+ cases
}

export function getRank(score: number | undefined) {
	if (score === undefined || score === 0) return Rank.ROOKIE;
	else if (score < 4) return Rank.SLEUTH;
	else if (score < 7) return Rank.PRIVATE_EYE;
	else if (score < 10) return Rank.INVESTIGATOR;
	else if (score < 14) return Rank.ACE_DETECTIVE;
	else return Rank.SUPER_SLEUTH;
}

const playersLocalStorage: string | null = browser ? window.localStorage.getItem('player') : null;

let player: Player | null = null;
export const playerStore = writable<Player | null>(null);

// Read existing player from localStorage
if (playersLocalStorage) {
	player = JSON.parse(playersLocalStorage) as Player;
	playerStore.set(player);
}

// Write player to localStorage
playerStore.subscribe((value) => {
	if (browser) {
		window.localStorage.setItem('player', JSON.stringify(value));
	}
});
