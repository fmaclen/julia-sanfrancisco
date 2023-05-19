import { browser } from '$app/environment';
import { writable } from 'svelte/store';

export interface Player {
	name: string;
	score: number;
	language: Language;
}

export type Language = 'en' | 'es';

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

const playerLocalStorage: string | null = browser ? window.localStorage.getItem('player') : null;

let player: Player | null = null;
export const playerStore = writable<Player | null>(null);

// Read existing player from localStorage
if (playerLocalStorage) {
	player = JSON.parse(playerLocalStorage) as Player;
	playerStore.set(player);
}

// Write player to localStorage
playerStore.subscribe((value) => {
	if (browser) {
		window.localStorage.setItem('player', JSON.stringify(value));
	}
});

export function getCasesUntilPromotion(score: number): string {
	let cases: number;

	if (score < 3) cases = 4 - score;
	else if (score < 6) cases = 7 - score;
	else if (score < 9) cases = 10 - score;
	else if (score < 13) cases = 14 - score;
	else return '';

	const caseWord = cases > 1 ? 'cases' : 'case';
	return `${cases} more ${caseWord} until your next promotion.`;
}
