export enum Suspect {
	JULIA_SANFRANCISCO = 'juliaSanfrancisco',
	CHRIS_LUNCHTIME = 'chrisLunchtime',
	DANIELLE_SPLASH = 'danielleSplash',
	DUCHESS_ISABELLA = 'duchessIsabella',
	HUGH_MASS = 'hughMass',
	MARK_FADENOTT = 'markFadenott',
	RENA_STONE = 'renaStone',
	SIMON_SIMONSKI = 'simonSimonski',
	SPARKLE_LILY = 'sparkleLily',
	SPEEDY_JAKE_Z = 'speedyJakeZ'
}

export enum WarrantSex {
	MALE = 'male',
	FEMALE = 'female'
}

export enum WarrantHobby {
	HIKING = 'hiking',
	TENNIS = 'tennis',
	CYCLING = 'cycling',
	GUITAR = 'guitar',
	GOLF = 'golf',
	GAMBLER = 'gambler',
	PICKLEBALL = 'pickleball'
}

export enum WarrantHair {
	BLACK = 'black',
	BROWN = 'brown',
	BLOND = 'blond',
	RED = 'red'
}

export enum WarrantFeature {
	SCAR = 'scar',
	GLASSES = 'glasses',
	TATTOO = 'tattoo',
	BIRTHMARK = 'birthmark',
	RING = 'ring',
	NECKLACE = 'necklace'
}

export enum WarrantVehicle {
	BIKE = 'bike',
	MOTORCYCLE = 'motorcycle',
	HOVERBOARD = 'hoverboard',
	EXOTIC = 'exotic',
	CONVERTIBLE = 'convertible',
	LIMOUSINE = 'limousine',
	TRANSIT = 'transit',
	JET = 'jet'
}

export interface WarrantKeys {
	sex: WarrantSex;
	hobby: WarrantHobby;
	hair: WarrantHair;
	feature: WarrantFeature;
	vehicle: WarrantVehicle;
}

export function getSuspectWarrantKeys(suspect: Suspect): WarrantKeys {
	switch (suspect) {
		case Suspect.CHRIS_LUNCHTIME:
			return {
				sex: WarrantSex.MALE,
				hobby: WarrantHobby.GAMBLER,
				hair: WarrantHair.BLACK,
				feature: WarrantFeature.GLASSES,
				vehicle: WarrantVehicle.MOTORCYCLE
			};
		case Suspect.DANIELLE_SPLASH:
			return {
				sex: WarrantSex.FEMALE,
				hobby: WarrantHobby.HIKING,
				hair: WarrantHair.BROWN,
				feature: WarrantFeature.BIRTHMARK,
				vehicle: WarrantVehicle.HOVERBOARD
			};
		case Suspect.DUCHESS_ISABELLA:
			return {
				sex: WarrantSex.FEMALE,
				hobby: WarrantHobby.TENNIS,
				hair: WarrantHair.RED,
				feature: WarrantFeature.RING,
				vehicle: WarrantVehicle.EXOTIC
			};
		case Suspect.HUGH_MASS:
			return {
				sex: WarrantSex.MALE,
				hobby: WarrantHobby.HIKING,
				hair: WarrantHair.RED,
				feature: WarrantFeature.TATTOO,
				vehicle: WarrantVehicle.CONVERTIBLE
			};
		case Suspect.JULIA_SANFRANCISCO:
			return {
				sex: WarrantSex.FEMALE,
				hobby: WarrantHobby.CYCLING,
				hair: WarrantHair.BLOND,
				feature: WarrantFeature.NECKLACE,
				vehicle: WarrantVehicle.CONVERTIBLE
			};
		case Suspect.MARK_FADENOTT:
			return {
				sex: WarrantSex.MALE,
				hobby: WarrantHobby.GUITAR,
				hair: WarrantHair.BLOND,
				feature: WarrantFeature.RING,
				vehicle: WarrantVehicle.LIMOUSINE
			};
		case Suspect.RENA_STONE:
			return {
				sex: WarrantSex.FEMALE,
				hobby: WarrantHobby.CYCLING,
				hair: WarrantHair.BROWN,
				feature: WarrantFeature.GLASSES,
				vehicle: WarrantVehicle.TRANSIT
			};
		case Suspect.SIMON_SIMONSKI:
			return {
				sex: WarrantSex.MALE,
				hobby: WarrantHobby.GOLF,
				hair: WarrantHair.BLACK,
				feature: WarrantFeature.TATTOO,
				vehicle: WarrantVehicle.JET
			};
		case Suspect.SPARKLE_LILY:
			return {
				sex: WarrantSex.FEMALE,
				hair: WarrantHair.BLOND,
				hobby: WarrantHobby.GAMBLER,
				feature: WarrantFeature.TATTOO,
				vehicle: WarrantVehicle.LIMOUSINE
			};
		case Suspect.SPEEDY_JAKE_Z:
			return {
				sex: WarrantSex.MALE,
				hobby: WarrantHobby.PICKLEBALL,
				hair: WarrantHair.BLACK,
				feature: WarrantFeature.SCAR,
				vehicle: WarrantVehicle.BIKE
			};
		default:
			throw new Error('No warrant found for this suspect.');
	}
}

export function findSuspect(
	sex?: WarrantSex,
	hobby?: WarrantHobby,
	hair?: WarrantHair,
	feature?: WarrantFeature,
	vehicle?: WarrantVehicle
): Suspect[] {
	const matchingSuspects: Suspect[] = [];

	for (const suspect of Object.values(Suspect)) {
		const warrantKeys = getSuspectWarrantKeys(suspect);
		const {
			sex: suspectSex,
			hobby: suspectHobby,
			hair: suspectHair,
			feature: suspectFeature,
			vehicle: suspectVehicle
		} = warrantKeys;

		if (
			(sex === undefined || sex === suspectSex) &&
			(hobby === undefined || hobby === suspectHobby) &&
			(hair === undefined || hair === suspectHair) &&
			(feature === undefined || feature === suspectFeature) &&
			(vehicle === undefined || vehicle === suspectVehicle)
		) {
			matchingSuspects.push(suspect);
		}
	}

	return matchingSuspects;
}
