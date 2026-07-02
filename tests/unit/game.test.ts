import { i18nObject } from '$i18n/i18n-util';
import { loadLocale } from '$i18n/i18n-util.sync';
import {
	EXCLUDED_PLACES_BY_ATLAS_KEY,
	getAllowedPlacesForAtlasKey,
	type AtlasKey
} from '$lib/atlas-places';
import { generateDecoyRound, generateGame, type Round } from '$lib/game';
import type { Place } from '$lib/places';
import { beforeAll, describe, expect, test } from 'vitest';

beforeAll(() => {
	loadLocale('en');
});

function getLL() {
	return i18nObject('en');
}

function expectRoundPlacesAllowed(round: Round): void {
	const excludedPlaces = new Set<Place>(EXCLUDED_PLACES_BY_ATLAS_KEY[round.atlas.key]);

	for (const scene of round.scenes) {
		expect(excludedPlaces.has(scene.place.place), round.atlas.city).toBe(false);
	}
}

describe('atlas place exclusions', () => {
	test('keeps at least six allowed places for every atlas', () => {
		for (const atlasKey of Object.keys(EXCLUDED_PLACES_BY_ATLAS_KEY) as AtlasKey[]) {
			expect(getAllowedPlacesForAtlasKey(atlasKey).length, atlasKey).toBeGreaterThanOrEqual(6);
		}
	});
});

describe('round generation', () => {
	test('generates six unique rounds with valid destinations and scenes', () => {
		for (let attempt = 0; attempt < 20; attempt++) {
			const game = generateGame(getLL());

			expect(game.rounds).toHaveLength(6);
			expect(new Set(game.rounds.map((round) => round.atlas.city))).toHaveLength(6);

			for (const [index, round] of game.rounds.entries()) {
				expect(round.destinations).toHaveLength(5);
				expect(round.destinations.map((atlas) => atlas.city)).not.toContain(round.atlas.city);

				if (index < game.rounds.length - 1) {
					expect(round.destinations.map((atlas) => atlas.city)).toContain(
						game.rounds[index + 1].atlas.city
					);
				}

				expect(round.scenes).toHaveLength(3);
				expect(new Set(round.scenes.map((scene) => scene.place.place))).toHaveLength(3);
				expectRoundPlacesAllowed(round);

				for (const scene of round.scenes) {
					expect(scene.clue.trim()).not.toBe('');
				}
			}
		}
	});

	test('decoy rounds include the anchor city and use allowed places', () => {
		const game = generateGame(getLL());

		for (const round of game.rounds) {
			const decoyRound = generateDecoyRound(getLL(), round.destinations[0], round.atlas);

			expect(decoyRound.destinations.map((atlas) => atlas.city)).toContain(round.atlas.city);
			expectRoundPlacesAllowed(decoyRound);
		}
	});
});

describe('clue generation', () => {
	test('does not leave wildcard braces in generated clue text', () => {
		for (let attempt = 0; attempt < 20; attempt++) {
			const game = generateGame(getLL());

			for (const round of game.rounds) {
				for (const scene of round.scenes) {
					expect(scene.clue.trim()).not.toBe('');
					expect(scene.clue).not.toMatch(/[{}]/);
				}
			}
		}
	});
});
