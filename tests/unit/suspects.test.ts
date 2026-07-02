import type { Locales, TranslationFunctions } from '$i18n/i18n-types';
import { i18nObject } from '$i18n/i18n-util';
import { loadLocale } from '$i18n/i18n-util.sync';
import {
	findSuspects,
	getSuspectWarrantKeys,
	Suspect,
	WarrantFeature,
	WarrantHair,
	WarrantHobby,
	type WarrantKeys,
	WarrantSex,
	WarrantVehicle
} from '$lib/suspects';
import { beforeAll, describe, expect, test } from 'vitest';

const expectedWarrantKeys = {
	[Suspect.CHRIS_LUNCHTIME]: {
		sex: WarrantSex.MALE,
		hobby: WarrantHobby.GAMBLER,
		hair: WarrantHair.BLACK,
		feature: WarrantFeature.GLASSES,
		vehicle: WarrantVehicle.MOTORCYCLE
	},
	[Suspect.DANIELLE_SPLASH]: {
		sex: WarrantSex.FEMALE,
		hobby: WarrantHobby.HIKING,
		hair: WarrantHair.BROWN,
		feature: WarrantFeature.BIRTHMARK,
		vehicle: WarrantVehicle.HOVERBOARD
	},
	[Suspect.DUCHESS_ISABELLA]: {
		sex: WarrantSex.FEMALE,
		hobby: WarrantHobby.TENNIS,
		hair: WarrantHair.RED,
		feature: WarrantFeature.RING,
		vehicle: WarrantVehicle.EXOTIC
	},
	[Suspect.HUGH_MASS]: {
		sex: WarrantSex.MALE,
		hobby: WarrantHobby.HIKING,
		hair: WarrantHair.RED,
		feature: WarrantFeature.TATTOO,
		vehicle: WarrantVehicle.CONVERTIBLE
	},
	[Suspect.JULIA_SANFRANCISCO]: {
		sex: WarrantSex.FEMALE,
		hobby: WarrantHobby.TENNIS,
		hair: WarrantHair.BROWN,
		feature: WarrantFeature.NECKLACE,
		vehicle: WarrantVehicle.CONVERTIBLE
	},
	[Suspect.MARK_FADENOTT]: {
		sex: WarrantSex.MALE,
		hobby: WarrantHobby.GUITAR,
		hair: WarrantHair.BLOND,
		feature: WarrantFeature.RING,
		vehicle: WarrantVehicle.LIMOUSINE
	},
	[Suspect.RENA_STONE]: {
		sex: WarrantSex.FEMALE,
		hobby: WarrantHobby.CYCLING,
		hair: WarrantHair.BROWN,
		feature: WarrantFeature.GLASSES,
		vehicle: WarrantVehicle.TRANSIT
	},
	[Suspect.SIMON_SIMONSKI]: {
		sex: WarrantSex.MALE,
		hobby: WarrantHobby.GOLF,
		hair: WarrantHair.BLOND,
		feature: WarrantFeature.TATTOO,
		vehicle: WarrantVehicle.JET
	},
	[Suspect.SPARKLE_LILY]: {
		sex: WarrantSex.FEMALE,
		hobby: WarrantHobby.GAMBLER,
		hair: WarrantHair.BLOND,
		feature: WarrantFeature.TATTOO,
		vehicle: WarrantVehicle.LIMOUSINE
	},
	[Suspect.SPEEDY_JAKE_Z]: {
		sex: WarrantSex.MALE,
		hobby: WarrantHobby.PICKLEBALL,
		hair: WarrantHair.BLACK,
		feature: WarrantFeature.SCAR,
		vehicle: WarrantVehicle.BIKE
	}
} satisfies Record<Suspect, WarrantKeys>;

type DossierField = 'hobby' | 'hair' | 'vehicle' | 'feature';

const dossierParaphrases: Partial<
	Record<Locales, Partial<Record<Suspect, Partial<Record<DossierField, string[]>>>>>
> = {
	en: {
		[Suspect.DUCHESS_ISABELLA]: { vehicle: ['lambrozzini', 'avenger'] },
		[Suspect.RENA_STONE]: {
			hair: ['brunette'],
			vehicle: ['public transportation']
		},
		[Suspect.SPEEDY_JAKE_Z]: { vehicle: ['e-bike'] }
	},
	es: {
		[Suspect.CHRIS_LUNCHTIME]: {
			vehicle: ['moto'],
			feature: ['anteojos']
		},
		[Suspect.DUCHESS_ISABELLA]: { vehicle: ['lambrozzini', 'avenger'] },
		[Suspect.HUGH_MASS]: { hair: ['negro'] },
		[Suspect.JULIA_SANFRANCISCO]: { vehicle: ['convertible'] },
		[Suspect.RENA_STONE]: {
			hobby: ['bicicleta'],
			hair: ['castano', 'castaño'],
			feature: ['anteojos']
		},
		[Suspect.SPEEDY_JAKE_Z]: { vehicle: ['e-bike'] }
	}
};

function getLL(locale: Locales): TranslationFunctions {
	loadLocale(locale);
	return i18nObject(locale);
}

function normalize(text: string, locale: Locales): string {
	return text.toLocaleLowerCase(locale);
}

function tupleKey(warrantKeys: WarrantKeys): string {
	return [
		warrantKeys.sex,
		warrantKeys.hobby,
		warrantKeys.hair,
		warrantKeys.feature,
		warrantKeys.vehicle
	].join('|');
}

function warrantLabel(LL: TranslationFunctions, field: DossierField, warrantKeys: WarrantKeys) {
	switch (field) {
		case 'hobby':
			return LL.warrants.hobby[warrantKeys.hobby]();
		case 'hair':
			return LL.warrants.hair[warrantKeys.hair]();
		case 'vehicle':
			return LL.warrants.vehicle[warrantKeys.vehicle]();
		case 'feature':
			return LL.warrants.feature[warrantKeys.feature]();
	}
}

describe('suspect warrant data', () => {
	beforeAll(() => {
		loadLocale('en');
		loadLocale('es');
	});

	test('matches the hand-audited warrant key table', () => {
		for (const suspect of Object.values(Suspect)) {
			expect(getSuspectWarrantKeys(suspect)).toEqual(expectedWarrantKeys[suspect]);
		}
	});

	test('keeps every suspect uniquely identifiable by the full warrant tuple', () => {
		const tuples = Object.values(Suspect).map((suspect) =>
			tupleKey(getSuspectWarrantKeys(suspect))
		);

		expect(new Set(tuples)).toHaveLength(Object.values(Suspect).length);
	});

	test.each(['en', 'es'] as const)(
		'%s dossiers match localized warrant labels or known paraphrases',
		(locale) => {
			const LL = getLL(locale);

			for (const suspect of Object.values(Suspect)) {
				const warrantKeys = getSuspectWarrantKeys(suspect);
				const dossier = LL.suspects[suspect];

				for (const field of ['hobby', 'hair', 'vehicle', 'feature'] as const) {
					const text = normalize(dossier[field](), locale);
					const label = normalize(warrantLabel(LL, field, warrantKeys), locale);
					const paraphrases = dossierParaphrases[locale]?.[suspect]?.[field] ?? [];

					expect(
						text.includes(label) || paraphrases.some((phrase) => text.includes(phrase)),
						`${locale} ${suspect} ${field}: "${text}" should match "${label}"`
					).toBe(true);
				}
			}
		}
	);
});

describe('findSuspects', () => {
	test('returns a single exact match for every full tuple', () => {
		for (const suspect of Object.values(Suspect)) {
			const keys = getSuspectWarrantKeys(suspect);

			expect(findSuspects(keys.sex, keys.hobby, keys.hair, keys.feature, keys.vehicle)).toEqual([
				suspect
			]);
		}
	});

	test('narrows partial criteria', () => {
		expect(findSuspects(WarrantSex.MALE, undefined, WarrantHair.BLACK).sort()).toEqual(
			[Suspect.CHRIS_LUNCHTIME, Suspect.SPEEDY_JAKE_Z].sort()
		);
		expect(findSuspects(undefined, WarrantHobby.TENNIS).sort()).toEqual(
			[Suspect.DUCHESS_ISABELLA, Suspect.JULIA_SANFRANCISCO].sort()
		);
	});

	test('returns all suspects for empty criteria', () => {
		expect(findSuspects().sort()).toEqual(Object.values(Suspect).sort());
	});

	test('returns no suspects for contradictory criteria', () => {
		expect(
			findSuspects(
				WarrantSex.MALE,
				WarrantHobby.PICKLEBALL,
				WarrantHair.RED,
				WarrantFeature.NECKLACE,
				WarrantVehicle.JET
			)
		).toEqual([]);
	});
});
