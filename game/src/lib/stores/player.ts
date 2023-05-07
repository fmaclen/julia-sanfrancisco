import { browser } from '$app/environment';
import type { Player } from '$lib/helpers';
import { writable } from 'svelte/store';

const playersLocalStorage: string | null = browser
  ? window.localStorage.getItem('player')
  : null;

console.log(playersLocalStorage)

let player: Player | null = null;
export const playerStore = writable<Player | null>(null);

// Read existing player from localStorage
if (playersLocalStorage) {
  console.log("playersLocalStorage",playersLocalStorage)
  player = JSON.parse(playersLocalStorage) as Player;
  playerStore.set(player);
}

// Write player to localStorage
playerStore.subscribe((value) => {
  console.log("playerStore.subscribe(value)",value)
  if (browser) {
    window.localStorage.setItem('player', JSON.stringify(value));
  }
});