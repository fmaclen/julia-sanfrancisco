import { getCasesUntilPromotion, getRank, Rank } from '$lib/player';
import { describe, expect, test } from 'vitest';

describe('player ranks', () => {
	test.each([
		[undefined, Rank.ROOKIE],
		[0, Rank.ROOKIE],
		[1, Rank.SLEUTH],
		[3, Rank.SLEUTH],
		[4, Rank.PRIVATE_EYE],
		[6, Rank.PRIVATE_EYE],
		[7, Rank.INVESTIGATOR],
		[9, Rank.INVESTIGATOR],
		[10, Rank.ACE_DETECTIVE],
		[13, Rank.ACE_DETECTIVE],
		[14, Rank.SUPER_SLEUTH]
	])('score %s maps to rank %s', (score, rank) => {
		expect(getRank(score)).toBe(rank);
	});
});

describe('promotion countdown', () => {
	test.each([
		[0, 3],
		[1, 2],
		[2, 1],
		[3, 3],
		[5, 1],
		[6, 3],
		[8, 1],
		[9, 4],
		[12, 1],
		[13, 0],
		[20, 0]
	])('score %s needs %s cases after current case', (score, cases) => {
		expect(getCasesUntilPromotion(score)).toBe(cases);
	});
});
