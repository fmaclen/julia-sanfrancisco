import { browser } from '$app/environment';
import type { Player } from '$lib/player';
import { writable } from 'svelte/store';

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
