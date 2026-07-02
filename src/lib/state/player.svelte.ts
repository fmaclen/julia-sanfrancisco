import { browser } from '$app/environment';
import type { Locales } from '$i18n/i18n-types';
import type { Player } from '$lib/player';

const PLAYER_STORAGE_KEY = 'player';
const PLAYER_STORAGE_VERSION = 1;

interface PersistedPlayerParse {
	player: Player | null;
	shouldMigrate: boolean;
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isLocale(value: unknown): value is Locales {
	return value === 'en' || value === 'es';
}

function isPlayer(value: unknown): value is Player {
	return (
		isRecord(value) &&
		typeof value.name === 'string' &&
		typeof value.score === 'number' &&
		Number.isFinite(value.score) &&
		isLocale(value.locale)
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

function readPersistedPlayer(raw: string | null): PersistedPlayerParse {
	const parsed = parseJson(raw);

	if (!isRecord(parsed)) return { player: null, shouldMigrate: false };

	if ('version' in parsed) {
		if (parsed.version !== PLAYER_STORAGE_VERSION) {
			return { player: null, shouldMigrate: false };
		}

		return isPlayer(parsed.data)
			? { player: parsed.data, shouldMigrate: false }
			: { player: null, shouldMigrate: false };
	}

	return isPlayer(parsed)
		? { player: parsed, shouldMigrate: true }
		: { player: null, shouldMigrate: false };
}

export function parsePersistedPlayer(raw: string | null): Player | null {
	return readPersistedPlayer(raw).player;
}

export function serializePlayer(player: Player | null): string | null {
	return player === null ? null : JSON.stringify({ version: PLAYER_STORAGE_VERSION, data: player });
}

function writePlayer(player: Player | null): void {
	if (!browser) return;

	const serialized = serializePlayer(player);

	if (serialized === null) {
		window.localStorage.removeItem(PLAYER_STORAGE_KEY);
	} else {
		window.localStorage.setItem(PLAYER_STORAGE_KEY, serialized);
	}
}

function loadPlayer(): Player | null {
	if (!browser) return null;

	const raw = window.localStorage.getItem(PLAYER_STORAGE_KEY);
	const { player, shouldMigrate } = readPersistedPlayer(raw);

	if (player && shouldMigrate) writePlayer(player);
	if (raw !== null && player === null) window.localStorage.removeItem(PLAYER_STORAGE_KEY);

	return player;
}

class PlayerState {
	player = $state<Player | null>(loadPlayer());

	save(): void {
		writePlayer(this.player);
	}
}

export const playerState = new PlayerState();
