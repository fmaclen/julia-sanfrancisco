import type { Translation } from '$i18n/i18n-types';
import { Place } from './places';

export type AtlasKey = keyof Translation['atlases'];

export const ALL_PLACES: readonly Place[] = [
	Place.AIRPORT,
	Place.BANK,
	Place.FOREIGN_MINISTRY,
	Place.HARBOR,
	Place.HOTEL,
	Place.LIBRARY,
	Place.MARKETPLACE,
	Place.MUSEUM,
	Place.PALACE,
	Place.RIVERFRONT,
	Place.SPORT_CLUB,
	Place.STOCK_EXCHANGE
];

export const EXCLUDED_PLACES_BY_ATLAS_KEY = {
	argentina: [],
	australia: [],
	brazil: [Place.RIVERFRONT],
	canada: [],
	china: [Place.HARBOR, Place.RIVERFRONT],
	comoros: [Place.RIVERFRONT],
	egypt: [Place.HARBOR],
	france: [Place.HARBOR],
	greece: [Place.RIVERFRONT],
	hungary: [Place.HARBOR],
	iceland: [Place.RIVERFRONT],
	india: [Place.HARBOR],
	iraq: [Place.HARBOR],
	italy: [Place.HARBOR],
	japan: [],
	mali: [Place.HARBOR],
	mexico: [Place.HARBOR, Place.RIVERFRONT],
	nepal: [Place.HARBOR],
	norway: [Place.RIVERFRONT],
	papuaNewGuinea: [Place.RIVERFRONT],
	peru: [],
	russia: [Place.HARBOR],
	rwanda: [Place.HARBOR, Place.RIVERFRONT],
	sanMarino: [Place.AIRPORT, Place.HARBOR, Place.RIVERFRONT],
	singapore: [],
	sriLanka: [],
	thailand: [],
	turkey: [Place.RIVERFRONT],
	unitedKingdom: [],
	unitedStates: []
} satisfies Record<AtlasKey, readonly Place[]>;

export function getAllowedPlacesForAtlasKey(atlasKey: AtlasKey): Place[] {
	const excludedPlaces = new Set<Place>(EXCLUDED_PLACES_BY_ATLAS_KEY[atlasKey]);

	return ALL_PLACES.filter((place) => !excludedPlaces.has(place));
}
