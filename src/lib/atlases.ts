import { ARGENTINA } from '$lib/atlases/argentina';
import { AUSTRALIA } from '$lib/atlases/australia';
import { BRAZIL } from '$lib/atlases/brazil';
import { CHINA } from '$lib/atlases/china';
import { GREECE } from '$lib/atlases/greece';
import { ITALY } from '$lib/atlases/italy';
import { JAPAN } from '$lib/atlases/japan';
import { NORWAY } from '$lib/atlases/norway';
import { UNITED_KINGDOM } from '$lib/atlases/uk';
import { USA } from '$lib/atlases/usa';
import { getRandomValue } from './helpers';

export interface Atlas {
	city: string;
	descriptions: string[];
	currency: string;
	language: string;
	flag: string;
	leader: 'king' | 'president' | 'prime minister' | 'party chairman';
	see: string[];
	toDo: string[];
	trade: string[];
	study: string[];
	stolen: string[];
}

export const ATLASES = [
	ARGENTINA,
	AUSTRALIA,
	BRAZIL,
	CHINA,
	GREECE,
	ITALY,
	JAPAN,
	NORWAY,
	UNITED_KINGDOM,
	USA
];

export function getRandomAtlas(): Atlas {
	const atlas = getRandomValue(ATLASES);
	return atlas;
}

export function setRandomDestinations(destinations: Set<Atlas>, currentAtlas: Atlas) {
	const MAX_DESTINATIONS = 5;

	while (destinations.size < MAX_DESTINATIONS) {
		const randomAtlas = getRandomAtlas();

		// Do not add the current atlas as a possible destination
		if (randomAtlas !== currentAtlas) destinations.add(randomAtlas);
	}
}
