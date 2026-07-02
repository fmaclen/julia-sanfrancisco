import { browser } from '$app/environment';
import { EXCLUDED_PLACES_BY_ATLAS_KEY, type AtlasKey } from '$lib/atlas-places';
import type { Atlas, Game, Round, Scene } from '$lib/game';
import { Place } from '$lib/places';
import {
	Suspect,
	WarrantFeature,
	WarrantHair,
	WarrantHobby,
	WarrantSex,
	WarrantVehicle,
	type WarrantKeys
} from '$lib/suspects';

const GAME_STORAGE_KEY = 'game';
const GAME_STORAGE_VERSION = 1;

const PLACE_VALUES = new Set(
	Object.values(Place).filter((value): value is Place => typeof value === 'number')
);

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): value is string[] {
	return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

function isFiniteNumber(value: unknown): value is number {
	return typeof value === 'number' && Number.isFinite(value);
}

function isInteger(value: unknown): value is number {
	return Number.isInteger(value);
}

function isAtlasKey(value: unknown): value is AtlasKey {
	return typeof value === 'string' && value in EXCLUDED_PLACES_BY_ATLAS_KEY;
}

function isPlace(value: unknown): value is Place {
	return typeof value === 'number' && PLACE_VALUES.has(value);
}

function isOneOf<T extends string>(value: unknown, values: readonly T[]): value is T {
	return typeof value === 'string' && (values as readonly string[]).includes(value);
}

function isSuspect(value: unknown): value is Suspect {
	return isOneOf(value, Object.values(Suspect));
}

function isWarrantKeys(value: unknown): value is WarrantKeys {
	return (
		isRecord(value) &&
		isOneOf(value.sex, Object.values(WarrantSex)) &&
		isOneOf(value.hobby, Object.values(WarrantHobby)) &&
		isOneOf(value.hair, Object.values(WarrantHair)) &&
		isOneOf(value.feature, Object.values(WarrantFeature)) &&
		isOneOf(value.vehicle, Object.values(WarrantVehicle))
	);
}

function isAtlas(value: unknown): value is Atlas {
	return (
		isRecord(value) &&
		isAtlasKey(value.key) &&
		typeof value.city === 'string' &&
		isStringArray(value.descriptions) &&
		value.descriptions.length > 0 &&
		typeof value.currency === 'string' &&
		typeof value.language === 'string' &&
		typeof value.flag === 'string' &&
		typeof value.leader === 'string' &&
		isStringArray(value.sights) &&
		isStringArray(value.objects) &&
		isStringArray(value.topics) &&
		typeof value.artwork === 'string'
	);
}

function isLocalizedPlace(value: unknown): value is Scene['place'] {
	return isRecord(value) && isPlace(value.place) && typeof value.name === 'string';
}

function isLocalizedWitness(value: unknown): value is Scene['witness'] {
	return (
		isRecord(value) &&
		typeof value.witness === 'string' &&
		typeof value.name === 'string' &&
		typeof value.artwork === 'string'
	);
}

function isScene(value: unknown): value is Scene {
	return (
		isRecord(value) &&
		isLocalizedPlace(value.place) &&
		isLocalizedWitness(value.witness) &&
		typeof value.clue === 'string' &&
		(!('suspectClue' in value) ||
			value.suspectClue === undefined ||
			typeof value.suspectClue === 'string')
	);
}

function isRound(value: unknown): value is Round {
	return (
		isRecord(value) &&
		isAtlas(value.atlas) &&
		Array.isArray(value.scenes) &&
		value.scenes.length === 3 &&
		value.scenes.every(isScene) &&
		Array.isArray(value.destinations) &&
		value.destinations.length === 5 &&
		value.destinations.every(isAtlas)
	);
}

function isLocalizedSuspect(value: unknown): value is Game['suspect'] {
	return (
		isRecord(value) &&
		isSuspect(value.key) &&
		typeof value.name === 'string' &&
		typeof value.hobby === 'string' &&
		typeof value.hair === 'string' &&
		typeof value.feature === 'string' &&
		typeof value.vehicle === 'string' &&
		isStringArray(value.clues) &&
		isWarrantKeys(value.warrantKeys) &&
		isInteger(value.lastRoundHidingPlace) &&
		value.lastRoundHidingPlace >= 0 &&
		value.lastRoundHidingPlace < 3 &&
		typeof value.caught === 'boolean'
	);
}

function isGame(value: unknown): value is Game {
	if (!isRecord(value)) return false;
	if (!Array.isArray(value.rounds) || value.rounds.length !== 6 || !value.rounds.every(isRound)) {
		return false;
	}

	return (
		isInteger(value.currentRoundIndex) &&
		value.currentRoundIndex >= 0 &&
		value.currentRoundIndex < value.rounds.length &&
		isFiniteNumber(value.elapsedMinutes) &&
		(value.roundDecoy === null || isRound(value.roundDecoy)) &&
		typeof value.stolenTreasure === 'string' &&
		isLocalizedSuspect(value.suspect) &&
		Array.isArray(value.warrants) &&
		value.warrants.every(isSuspect)
	);
}

function parseJson(raw: string | null): unknown {
	if (raw === null) return null;

	try {
		return JSON.parse(raw);
	} catch {
		return null;
	}
}

export function parsePersistedGame(raw: string | null): Game | null {
	const parsed = parseJson(raw);

	if (!isRecord(parsed)) return null;
	if (parsed.version !== GAME_STORAGE_VERSION) return null;

	return isGame(parsed.data) ? parsed.data : null;
}

export function serializeGame(game: Game | null): string | null {
	return game === null ? null : JSON.stringify({ version: GAME_STORAGE_VERSION, data: game });
}

function writeGame(game: Game | null): void {
	if (!browser) return;

	const serialized = serializeGame(game);

	if (serialized === null) {
		window.localStorage.removeItem(GAME_STORAGE_KEY);
	} else {
		window.localStorage.setItem(GAME_STORAGE_KEY, serialized);
	}
}

function loadGame(): Game | null {
	if (!browser) return null;

	const raw = window.localStorage.getItem(GAME_STORAGE_KEY);
	const game = parsePersistedGame(raw);

	if (raw !== null && game === null) window.localStorage.removeItem(GAME_STORAGE_KEY);

	return game;
}

class SessionState {
	game = $state<Game | null>(loadGame());

	save(): void {
		writeGame(this.game);
	}
}

export const sessionState = new SessionState();
