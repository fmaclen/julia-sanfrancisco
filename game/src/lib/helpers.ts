import type { Round } from './rounds';
import type { Suspect } from './suspects';

export enum Rank {
	ROOKIE = 'Rookie', // 0 cases
	SLEUTH = 'Sleuth', // 1-3 cases
	PRIVATE_EYE = 'Private eye', // 4-6 cases
	INVESTIGATOR = 'Investigator', // 7-9 cases
	ACE_DETECTIVE = 'Ace detective', // 10-13 cases
	SUPER_SLEUTH = 'Super sleuth' // 14+ cases
}

export interface Game {
	currentTime: Date;
	stolenTreasure: string;
	suspect: Suspect;
	rounds: Round[];
}

export interface Player {
	name: string;
	score: number;
}

export function getRandomValue<T>(array: T[]): T {
	return array[Math.floor(Math.random() * array.length)];
}
