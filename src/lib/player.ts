import { browser } from '$app/environment';
import { setLocale } from '../i18n/i18n-svelte';
import type { Locales } from '../i18n/i18n-types';
import { loadLocale } from '../i18n/i18n-util.sync';
import { writable, type Writable } from 'svelte/store';

export interface Player {
	name: string;
	score: number;
	locale: Locales;
}

export enum Rank {
	ROOKIE, // 0 cases
	SLEUTH, // 1-3 cases
	PRIVATE_EYE, // 4-6 cases
	INVESTIGATOR, // 7-9 cases
	ACE_DETECTIVE, // 10-13 cases
	SUPER_SLEUTH // 14+ cases
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

export function getCasesUntilPromotion(score: number): number {
	let cases: number;
	score += 1; // Add 1 to score to account for the current case

	if (score < 3) cases = 4 - score;
	else if (score < 6) cases = 7 - score;
	else if (score < 9) cases = 10 - score;
	else if (score < 13) cases = 14 - score;
	else return 0;

	return cases;
}

export function applyLocale(locale: Locales, playerStore: Writable<Player | null>) {
	loadLocale(locale);
	setLocale(locale);

	if (playerLocalStorage) {
		player = JSON.parse(playerLocalStorage) as Player;

		if (!player) return;

		player.locale = locale;
		playerStore.set(player);
	}
}
