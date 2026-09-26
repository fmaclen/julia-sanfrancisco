/*
 * Palette for the rooftop layers in static/pixel-art/rooftops/. Every pixel in those PNGs is
 * one of these night colours; each colour has a role, and a variant (time of day + weather)
 * relights the scene by giving every colour a new value based on its role.
 */

export type TimeOfDay = 'night' | 'dusk' | 'day';
export type Weather = 'clear' | 'overcast' | 'rain' | 'fog';

export type Role =
	| 'sky'
	| 'cloud'
	| 'star'
	| 'moon'
	| 'horizon'
	| 'haze'
	| 'ink'
	| 'shadow'
	| 'window'
	| 'brick'
	| 'stone'
	| 'trim';

// Must match the palette the layer PNGs were exported with, entry for entry.
export const PALETTE = [
	['sky0', '#0d1533', 'sky'],
	['sky1', '#131b3d', 'sky'],
	['sky2', '#1b2248', 'sky'],
	['cloud', '#282c58', 'cloud'],
	['cloudLight', '#393b6f', 'cloud'],
	['star', '#eae8f6', 'star'],
	['moon0', '#978cb2', 'moon'],
	['moon1', '#bfaec6', 'moon'],
	['moon2', '#e9d4c1', 'moon'],
	['moon3', '#fee8c6', 'moon'],
	['horizon', '#383a6e', 'horizon'],
	['far2', '#34376a', 'haze'],
	['far3', '#45447c', 'haze'],
	['ink', '#04050b', 'ink'],
	['shade0', '#0b1230', 'shadow'],
	['shade1', '#171c42', 'shadow'],
	['shade2', '#262a55', 'shadow'],
	['amber0', '#50362c', 'window'],
	['amber1', '#7d5233', 'window'],
	['amber2', '#b5773c', 'window'],
	['amber3', '#e6a854', 'window'],
	['amber4', '#ffdf94', 'window'],
	['brick0', '#150e1a', 'brick'],
	['brick1', '#231722', 'brick'],
	['brick2', '#36222a', 'brick'],
	['brick3', '#51342f', 'brick'],
	['stone0', '#10142a', 'stone'],
	['stone1', '#1f2235', 'stone'],
	['stone2', '#2c2c40', 'stone'],
	['stone3', '#56516a', 'stone'],
	['trim', '#9f9aab', 'trim']
] as const satisfies readonly (readonly [string, string, Role])[];

export type ColorName = (typeof PALETTE)[number][0];
export type RGB = [number, number, number];

export const ROLES: Role[] = PALETTE.map((entry) => entry[2]);
export const NIGHT: RGB[] = PALETTE.map((entry) => hex(entry[1]));
export const INDEX = Object.fromEntries(PALETTE.map((entry, i) => [entry[0], i])) as Record<
	ColorName,
	number
>;

// Time of day swaps whole colours. Anything not listed keeps its night value.
const TIME: Record<TimeOfDay, Partial<Record<ColorName, string>>> = {
	night: {},
	dusk: {
		sky0: '#2c2452',
		sky1: '#5b3463',
		sky2: '#9c4b68',
		cloud: '#d0735c',
		cloudLight: '#f2a669',
		star: '#6b4e7c',
		moon0: '#c0a2ae',
		moon1: '#d6b8b8',
		moon2: '#efd8c8',
		moon3: '#f8e6d4',
		horizon: '#d9785e',
		far2: '#5a3d6c',
		far3: '#7a4d78',
		shade0: '#150e2a',
		shade1: '#24173c',
		shade2: '#382350',
		brick0: '#1c0f1a',
		brick1: '#321a24',
		brick2: '#4c2a2e',
		brick3: '#6e4032',
		stone0: '#1a1328',
		stone1: '#2c2236',
		stone2: '#403246',
		stone3: '#76606e',
		trim: '#d0aaa4'
	},
	// The painting's lighting is nocturnal, so day is a stylised relight rather than a real one.
	day: {
		sky0: '#5b8fd0',
		sky1: '#78a6dc',
		sky2: '#98bde4',
		cloud: '#d6e2f0',
		cloudLight: '#f4f7fb',
		star: '#5b8fd0',
		moon0: '#9fb6de',
		moon1: '#b3c7e6',
		moon2: '#cfdcef',
		moon3: '#dfe8f5',
		horizon: '#bcd3ea',
		far2: '#8ea6cc',
		far3: '#a6bad8',
		ink: '#1b1d2a',
		shade0: '#415379',
		shade1: '#566a92',
		shade2: '#6f84aa',
		amber0: '#2f3b58',
		amber1: '#43547a',
		amber2: '#5b7099',
		amber3: '#7e94ba',
		amber4: '#aabdd8',
		brick0: '#3a2126',
		brick1: '#5c2f2f',
		brick2: '#7e4038',
		brick3: '#a05a44',
		stone0: '#4c4d5c',
		stone1: '#666775',
		stone2: '#83828f',
		stone3: '#aaa6b2',
		trim: '#e2dee6'
	}
};

// Colour the weather pulls the sky and the distance toward, per time of day.
const MURK: Record<TimeOfDay, RGB> = {
	night: hex('#2a2c40'),
	dusk: hex('#6a4e62'),
	day: hex('#a9b1bf')
};

const FOG: Record<TimeOfDay, RGB> = {
	night: hex('#3d3f5e'),
	dusk: hex('#94707c'),
	day: hex('#c9ced8')
};

/**
 * Colours for one layer under one variant. `depth` runs from 0 (sky) to 1 (front buildings),
 * so fog can swallow the distance more than the foreground.
 */
export function variantColors(timeOfDay: TimeOfDay, weather: Weather, depth: number): RGB[] {
	const overrides = TIME[timeOfDay];
	const base = PALETTE.map(([name], i) => {
		const swap = overrides[name];
		return swap ? hex(swap) : NIGHT[i];
	});
	if (weather === 'clear') return base;

	const sky = (name: ColorName) => base[INDEX[name]];
	return base.map((color, i) => {
		const role = ROLES[i];
		if (weather === 'fog') {
			const amount = role === 'window' ? 0.35 * (1 - depth) : 0.75 - depth * 0.55;
			if (role === 'star') return sky('sky1');
			return mix(color, FOG[timeOfDay], role === 'moon' ? 0.55 : amount);
		}
		// Overcast and rain: a cloud deck hides the stars and the moon and greys everything out.
		const heavy = weather === 'rain';
		const murk = MURK[timeOfDay];
		if (role === 'star') return mix(sky('sky1'), murk, 0.5);
		if (role === 'moon') return mix(sky('cloudLight'), murk, 0.35);
		if (role === 'sky' || role === 'cloud' || role === 'horizon')
			return mix(color, murk, heavy ? 0.6 : 0.5);
		if (role === 'window') return color;
		const grey = desaturate(color, heavy ? 0.45 : 0.35);
		return scale(mix(grey, murk, depth < 0.5 ? 0.25 : 0.08), heavy ? 0.85 : 0.95);
	});
}

function hex(value: string): RGB {
	const n = parseInt(value.slice(1), 16);
	return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function mix(a: RGB, b: RGB, t: number): RGB {
	return [0, 1, 2].map((k) => Math.round(a[k] + (b[k] - a[k]) * t)) as RGB;
}

function desaturate(c: RGB, t: number): RGB {
	const grey = Math.round(c[0] * 0.3 + c[1] * 0.59 + c[2] * 0.11);
	return mix(c, [grey, grey, grey], t);
}

function scale(c: RGB, f: number): RGB {
	return c.map((v) => Math.round(v * f)) as RGB;
}
