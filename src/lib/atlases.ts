import { ARGENTINA } from '$lib/atlases/argentina';
import { AUSTRALIA } from '$lib/atlases/australia';
import { BRAZIL } from '$lib/atlases/brazil';
import { CANADA } from '$lib/atlases/canada';
import { CHINA } from '$lib/atlases/china';
import { COMOROS } from '$lib/atlases/comoros';
import { EGYPT } from '$lib/atlases/egypt';
import { FRANCE } from '$lib/atlases/france';
import { GREECE } from '$lib/atlases/greece';
import { HUNGARY } from '$lib/atlases/hungary';
import { ICELAND } from '$lib/atlases/iceland';
import { INDIA } from '$lib/atlases/india';
import { IRAQ } from '$lib/atlases/iraq';
import { ITALY } from '$lib/atlases/italy';
import { JAPAN } from '$lib/atlases/japan';
import { MALI } from '$lib/atlases/mali';
import { MEXICO } from '$lib/atlases/mexico';
import { NEPAL } from '$lib/atlases/nepal';
import { NORWAY } from '$lib/atlases/norway';
import { PAPUA_NEW_GUINEA } from '$lib/atlases/papua-new-guinea';
import { PERU } from '$lib/atlases/peru';
import { RUSSIA } from '$lib/atlases/russia';
import { RWANDA } from '$lib/atlases/rwanda';
import { SAN_MARINO } from '$lib/atlases/san-marino';
import { SINGAPORE } from '$lib/atlases/singapore';
import { SRI_LANKA } from '$lib/atlases/sri-lanka';
import { THAILAND } from '$lib/atlases/thailand';
import { TURKEY } from '$lib/atlases/turkey';
import { UNITED_KINGDOM } from '$lib/atlases/united-kingdom';
import { USA } from '$lib/atlases/united-states';
import { getRandomValue } from '$lib/helpers';

export interface Atlas {
	city: string;
	descriptions: string[];
	currency: string;
	language: string;
	flag: string;
	leader: string;
	places: string[];
	objects: string[];
	topics: string[];
}

export const ATLASES = [
	ARGENTINA,
	AUSTRALIA,
	BRAZIL,
	CANADA,
	CHINA,
	COMOROS,
	EGYPT,
	FRANCE,
	GREECE,
	HUNGARY,
	ICELAND,
	INDIA,
	IRAQ,
	ITALY,
	JAPAN,
	MALI,
	MEXICO,
	NEPAL,
	NORWAY,
	PAPUA_NEW_GUINEA,
	PERU,
	RUSSIA,
	RWANDA,
	SAN_MARINO,
	SINGAPORE,
	SRI_LANKA,
	THAILAND,
	TURKEY,
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
