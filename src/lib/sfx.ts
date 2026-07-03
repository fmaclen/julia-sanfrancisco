export type SfxName =
	| 'click'
	| 'back'
	| 'confirm'
	| 'walk'
	| 'fly'
	| 'clue'
	| 'alert'
	| 'warrant'
	| 'victory'
	| 'gameover'
	| 'sleep'
	| 'type'
	| 'arrest';

type NoteSpec = {
	offsetMs: number;
	durationMs: number;
	freqStart: number;
	freqEnd?: number;
	volume?: number;
};

type Recipe = NoteSpec[] | ((durationMs?: number) => NoteSpec[]);

const STORAGE_KEY = 'sfxMuted';
const MASTER_GAIN = 0.12;
const ATTACK_SECONDS = 0.002;
const RELEASE_SECONDS = 0.015;

function cricketNotes(durationMs = 4400): NoteSpec[] {
	const notes: NoteSpec[] = [];

	for (let groupStart = 0; groupStart + 168 <= durationMs; groupStart += 900) {
		for (let chirp = 0; chirp < 3; chirp++) {
			notes.push({
				offsetMs: groupStart + chirp * 75,
				durationMs: 18,
				freqStart: 4200,
				volume: 0.25
			});
		}
	}

	for (let groupStart = 450; groupStart + 156 <= durationMs; groupStart += 950) {
		for (let chirp = 0; chirp < 3; chirp++) {
			notes.push({
				offsetMs: groupStart + chirp * 70,
				durationMs: 16,
				freqStart: 3500,
				volume: 0.2
			});
		}
	}

	return notes;
}

const sfxRecipes: Record<SfxName, Recipe> = {
	click: [{ offsetMs: 0, durationMs: 20, freqStart: 1800, freqEnd: 150, volume: 0.8 }],
	back: [{ offsetMs: 0, durationMs: 25, freqStart: 500 }],
	confirm: [
		{ offsetMs: 0, durationMs: 50, freqStart: 660 },
		{ offsetMs: 60, durationMs: 90, freqStart: 990 }
	],
	walk: Array.from({ length: 7 }, (_, index) => ({
		offsetMs: index * 150,
		durationMs: 20,
		freqStart: index % 2 === 0 ? 220 : 180,
		volume: 0.7
	})),
	fly: [
		...Array.from({ length: 28 }, (_, index) => {
			const spoolUp = Math.round(80 * 1.18 ** Math.min(index, 8));
			const isOffbeat = index > 8 && index % 2 === 1;

			return {
				offsetMs: index * 60,
				durationMs: 25,
				freqStart: isOffbeat ? Math.round(spoolUp * 0.92) : spoolUp,
				volume: 0.7
			};
		}),
		{ offsetMs: 1740, durationMs: 260, freqStart: 294, freqEnd: 392, volume: 0.5 }
	],
	clue: [620, 780, 540, 860, 700].map((freqStart, index) => ({
		offsetMs: index * 65,
		durationMs: 30,
		freqStart,
		volume: 0.8
	})),
	alert: Array.from({ length: 16 }, (_, index) => ({
		offsetMs: index * 250,
		durationMs: 240,
		freqStart: index % 2 === 0 ? 240 : 360,
		freqEnd: index % 2 === 0 ? 360 : 240,
		volume: 0.6
	})),
	warrant: [
		...Array.from({ length: 8 }, (_, index) => ({
			offsetMs: index * 45,
			durationMs: 18,
			freqStart: index % 2 === 0 ? 1200 : 1500,
			volume: 0.6
		})),
		{ offsetMs: 413, durationMs: 140, freqStart: 990 }
	],
	victory: [
		{ offsetMs: 0, durationMs: 80, freqStart: 392, volume: 0.9 },
		{ offsetMs: 90, durationMs: 80, freqStart: 392, volume: 0.9 },
		{ offsetMs: 180, durationMs: 80, freqStart: 392, volume: 0.9 },
		{ offsetMs: 270, durationMs: 300, freqStart: 523 },
		{ offsetMs: 620, durationMs: 80, freqStart: 659, volume: 0.9 },
		{ offsetMs: 710, durationMs: 300, freqStart: 784 },
		{ offsetMs: 1060, durationMs: 80, freqStart: 659, volume: 0.9 },
		{ offsetMs: 1150, durationMs: 80, freqStart: 784, volume: 0.9 },
		{ offsetMs: 1240, durationMs: 80, freqStart: 880, volume: 0.9 },
		{ offsetMs: 1330, durationMs: 600, freqStart: 1047 }
	],
	gameover: [
		{ offsetMs: 0, durationMs: 300, freqStart: 392, freqEnd: 370, volume: 0.9 },
		{ offsetMs: 340, durationMs: 300, freqStart: 349, freqEnd: 330, volume: 0.9 },
		{ offsetMs: 680, durationMs: 300, freqStart: 311, freqEnd: 294, volume: 0.9 },
		{ offsetMs: 1020, durationMs: 700, freqStart: 294, freqEnd: 208, volume: 0.9 }
	],
	sleep: cricketNotes,
	type: [{ offsetMs: 0, durationMs: 12, freqStart: 1400, volume: 0.3 }],
	arrest: [
		...[0, 600].flatMap((blastStart) =>
			Array.from({ length: 14 }, (_, index) => ({
				offsetMs: blastStart + index * 35,
				durationMs: 35,
				freqStart: index % 2 === 0 ? 2200 : 2350,
				volume: 0.5
			}))
		),
		...Array.from({ length: 12 }, (_, index) => ({
			offsetMs: 1300 + index * 110,
			durationMs: 20,
			freqStart: index % 2 === 0 ? 210 : 170,
			volume: 0.6
		})),
		{ offsetMs: 2900, durationMs: 18, freqStart: 1600, freqEnd: 200, volume: 0.8 },
		{ offsetMs: 3060, durationMs: 18, freqStart: 1600, freqEnd: 200, volume: 0.8 }
	]
};

let audioContext: AudioContext | null = null;
let masterGain: GainNode | null = null;
let mutedCache: boolean | null = null;

function readMuted(): boolean {
	if (typeof window === 'undefined') return false;
	if (mutedCache !== null) return mutedCache;

	try {
		mutedCache = window.localStorage.getItem(STORAGE_KEY) === 'true';
	} catch {
		mutedCache = false;
	}

	return mutedCache;
}

function getAudioContext(): AudioContext | null {
	if (typeof window === 'undefined') return null;
	if (audioContext !== null && masterGain !== null) return audioContext;

	const AudioContextConstructor = window.AudioContext;
	if (AudioContextConstructor === undefined) return null;

	audioContext = new AudioContextConstructor();
	masterGain = audioContext.createGain();
	masterGain.gain.value = MASTER_GAIN;
	masterGain.connect(audioContext.destination);

	return audioContext;
}

function tone(
	context: AudioContext,
	startAtSeconds: number,
	durationSeconds: number,
	freqStart: number,
	freqEnd = freqStart,
	volume = 1
): void {
	if (masterGain === null) return;

	const osc = context.createOscillator();
	const gain = context.createGain();
	const endAtSeconds = startAtSeconds + durationSeconds;
	const attackEndSeconds = Math.min(startAtSeconds + ATTACK_SECONDS, endAtSeconds);
	const releaseStartSeconds = Math.max(attackEndSeconds, endAtSeconds - RELEASE_SECONDS);

	osc.type = 'square';
	osc.frequency.setValueAtTime(freqStart, startAtSeconds);

	if (freqEnd !== freqStart) {
		osc.frequency.exponentialRampToValueAtTime(freqEnd, endAtSeconds);
	}

	gain.gain.setValueAtTime(0, startAtSeconds);
	gain.gain.linearRampToValueAtTime(volume, attackEndSeconds);
	gain.gain.setValueAtTime(volume, releaseStartSeconds);
	gain.gain.exponentialRampToValueAtTime(0.0001, endAtSeconds);

	osc.connect(gain);
	gain.connect(masterGain);
	osc.onended = () => {
		osc.disconnect();
		gain.disconnect();
	};
	osc.start(startAtSeconds);
	osc.stop(endAtSeconds);
}

function scheduleNotes(context: AudioContext, notes: NoteSpec[]): void {
	const now = context.currentTime;

	for (const note of notes) {
		tone(
			context,
			now + note.offsetMs / 1000,
			note.durationMs / 1000,
			note.freqStart,
			note.freqEnd,
			note.volume
		);
	}
}

export function playSfx(name: SfxName, durationMs?: number): void {
	try {
		if (readMuted()) return;

		const context = getAudioContext();
		if (context === null) return;

		const recipe = sfxRecipes[name];
		const notes = typeof recipe === 'function' ? recipe(durationMs) : recipe;

		if (context.state === 'suspended') {
			const requestedAt = performance.now();
			void context
				.resume()
				.then(() => {
					if (performance.now() - requestedAt < 100) scheduleNotes(context, notes);
				})
				.catch(() => undefined);
			return;
		}

		scheduleNotes(context, notes);
	} catch {
		return;
	}
}

export function unlockSfx(): void {
	try {
		if (readMuted()) return;

		const context = getAudioContext();
		if (context === null || context.state === 'running') return;

		void context.resume().catch(() => undefined);
	} catch {
		return;
	}
}

export function setSfxMuted(muted: boolean): void {
	mutedCache = muted;

	if (typeof window === 'undefined') return;

	try {
		window.localStorage.setItem(STORAGE_KEY, muted ? 'true' : 'false');
	} catch {
		return;
	}
}

export function isSfxMuted(): boolean {
	return readMuted();
}
