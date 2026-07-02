import { i18nObject } from '$i18n/i18n-util';
import { loadLocale } from '$i18n/i18n-util.sync';
import { generateGame } from '$lib/game';
import { parsePersistedPlayer, serializePlayer } from '$lib/state/player.svelte';
import { parsePersistedGame, serializeGame } from '$lib/state/session.svelte';
import { beforeAll, describe, expect, test } from 'vitest';

beforeAll(() => {
	loadLocale('en');
});

function getGame() {
	return generateGame(i18nObject('en'));
}

describe('versioned persistence', () => {
	test('roundtrips valid v1 game and player data', () => {
		const game = getGame();
		const player = { name: 'Olivia Starling', score: 3, locale: 'en' as const };

		expect(parsePersistedGame(serializeGame(game))).toEqual(game);
		expect(parsePersistedPlayer(serializePlayer(player))).toEqual(player);
	});

	test('migrates legacy player data', () => {
		const player = { name: 'Rupert Westington', score: 5, locale: 'es' as const };
		const migrated = parsePersistedPlayer(JSON.stringify(player));

		expect(migrated).toEqual(player);
		expect(serializePlayer(migrated)).toBe(JSON.stringify({ version: 1, data: player }));
	});

	test('returns null for corrupted JSON', () => {
		expect(parsePersistedGame('{')).toBeNull();
		expect(parsePersistedPlayer('{')).toBeNull();
	});

	test('returns null for wrong versions', () => {
		const game = getGame();
		const player = { name: 'Olivia Starling', score: 3, locale: 'en' as const };

		expect(parsePersistedGame(JSON.stringify({ version: 2, data: game }))).toBeNull();
		expect(parsePersistedPlayer(JSON.stringify({ version: 2, data: player }))).toBeNull();
	});

	test('returns null when nested runtime game keys are missing', () => {
		const game = JSON.parse(JSON.stringify(getGame()));

		delete game.suspect.warrantKeys;

		expect(parsePersistedGame(JSON.stringify({ version: 1, data: game }))).toBeNull();
	});
});
