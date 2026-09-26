/*
 * Animated rooftop splash scene. Five palette-indexed layers (static/pixel-art/rooftops/) are
 * recoloured per variant, cached, and composited with whole-pixel parallax. A requestAnimationFrame
 * loop adds twinkling stars, windows switching on and off, weather, and a chase between Julia and
 * the detective, but only repaints the canvas when one of those actually changed.
 */
import {
	INDEX,
	NIGHT,
	ROLES,
	type RGB,
	type TimeOfDay,
	type Weather,
	variantColors
} from './rooftop-palette';

export type { TimeOfDay, Weather };

const LAYER_W = 222;
const LAYER_H = 444;
// The canvas is smaller than the layers so parallax never exposes a layer's edge.
const MARGIN = 4;
export const SCENE_WIDTH = LAYER_W - MARGIN * 2;
export const SCENE_HEIGHT = LAYER_H - MARGIN * 2;

const TRANSPARENT = 255;
const LAYERS = [
	{ name: 'sky', shift: 0 },
	{ name: 'skyline', shift: 1 },
	{ name: 'mid', shift: 2 },
	{ name: 'left', shift: 4 },
	{ name: 'right', shift: 4 }
] as const;
type LayerName = (typeof LAYERS)[number]['name'];

// Where the characters' feet rest, in layer pixels.
const LEFT_ROOF_Y = 248;
const RIGHT_ROOF_Y = 233;
// Centre of the detective's cell when he stops: his front foot lands at the ledge's end.
const DETECTIVE_STOP_X = 74;
const LOOP_MS = 10000;

type Indexed = { width: number; height: number; data: Uint8Array };
type Sheet = { image: HTMLCanvasElement; frames: number; cell: number; feet: number[] };
type Actor = { sheet: Sheet; frame: number; x: number; y: number; alpha: number };
type Window = { layer: LayerName; x: number; y: number; w: number; h: number; pixels: number[] };
type Sheets = { julia: Sheet; detective: Sheet };
type Drop = { x: number; y: number; speed: number; length: number; near: boolean };

export function createRooftopScene(canvas: HTMLCanvasElement) {
	const ctx = canvas.getContext('2d')!;
	const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
	const started = performance.now();

	let layers: Record<LayerName, Indexed> | null = null;
	let sheets: Sheets | null = null;
	let variant: { timeOfDay: TimeOfDay; weather: Weather } = {
		timeOfDay: 'night',
		weather: 'clear'
	};
	let painted: Record<LayerName, HTMLCanvasElement> | null = null;
	let windowsOff = new Map<Window, HTMLCanvasElement>();
	let colors: RGB[] = NIGHT;
	let clouds: HTMLCanvasElement | null = null;
	let fogBand: HTMLCanvasElement | null = null;

	let windows: Window[] = [];
	let stars: [number, number][] = [];
	const off = new Set<Window>();
	let nextFlicker = 0;
	const drops: Drop[] = [];

	// Parallax input in -1..1, eased toward the target so layers step one pixel at a time.
	const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
	let lastKey = '';
	let raf = 0;
	let destroyed = false;

	Promise.all([
		Promise.all(LAYERS.map((l) => loadIndexed(`/pixel-art/rooftops/${l.name}.png`))),
		// The scene still works without its characters.
		loadSheets().catch(() => null)
	]).then(([loaded, loadedSheets]) => {
		if (destroyed) return;
		layers = Object.fromEntries(LAYERS.map((l, i) => [l.name, loaded[i]])) as typeof layers;
		sheets = loadedSheets;
		stars = findStars(layers!.sky);
		windows = findWindows(layers!);
		prepare();
		start();
	});

	function prepare() {
		if (!layers) return;
		const { timeOfDay, weather } = variant;
		colors = variantColors(timeOfDay, weather, 1);
		painted = Object.fromEntries(
			LAYERS.map((l, i) => {
				const depth = i / (LAYERS.length - 1);
				return [l.name, paint(layers![l.name], variantColors(timeOfDay, weather, depth))];
			})
		) as typeof painted;
		windowsOff = new Map(
			windows.map((w) => [w, paintWindowOff(w, variantColors(timeOfDay, weather, 1))])
		);
		off.clear();
		clouds =
			weather === 'overcast' || weather === 'rain' ? makeClouds(colors, weather === 'rain') : null;
		fogBand = weather === 'fog' ? makeFogBand(colors) : null;
		drops.length = 0;
		if (weather === 'rain') {
			for (let i = 0; i < 150; i++) drops.push(newDrop(Math.random() * LAYER_H));
		}
		lastKey = '';
	}

	function start() {
		if (reducedMotion) {
			draw(0);
			return;
		}
		addEventListener('pointermove', onPointer);
		if (!needsOrientationPermission()) addEventListener('deviceorientation', onOrientation);
		const tick = (now: number) => {
			if (destroyed) return;
			draw(now - started);
			raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);
	}

	function draw(t: number) {
		if (!painted) return;
		const motion = !reducedMotion;

		pointer.x += (pointer.tx - pointer.x) * 0.08;
		pointer.y += (pointer.ty - pointer.y) * 0.08;
		const offsets = LAYERS.map((l) => [
			motion ? Math.round(-pointer.x * l.shift) : 0,
			motion ? Math.round(-pointer.y * l.shift * 0.5) : 0
		]);

		const ambient = motion ? t : 0;
		const twinkle = Math.floor(ambient / 350);
		if (motion) flicker(t);
		const cloudX = Math.floor(ambient / 400) % (LAYER_W * 2);
		const fogX = Math.floor(ambient / 90);
		const rainTick = Math.floor(ambient / 33);
		if (motion && drops.length) moveDrops(rainTick);
		const actors = !sheets ? [] : motion ? chase(t % LOOP_MS, sheets) : tableau(sheets);

		const key = [
			offsets.flat().join(),
			twinkle,
			[...off].map((w) => windows.indexOf(w)).join(),
			clouds ? cloudX : '',
			fogBand ? fogX : '',
			drops.length ? rainTick : '',
			actors.map((a) => `${a.frame},${Math.round(a.x)},${Math.round(a.y)},${a.alpha}`).join(';')
		].join('|');
		if (key === lastKey) return;
		lastKey = key;

		const place = (name: LayerName) => {
			const [dx, dy] = offsets[LAYERS.findIndex((l) => l.name === name)];
			return [dx - MARGIN, dy - MARGIN];
		};
		const drawLayer = (name: LayerName) => {
			const [x, y] = place(name);
			ctx.drawImage(painted![name], x, y);
			for (const w of off) {
				if (w.layer === name) ctx.drawImage(windowsOff.get(w)!, x + w.x, y + w.y);
			}
		};

		drawLayer('sky');
		if (variant.weather === 'clear' && variant.timeOfDay !== 'day')
			drawTwinkle(twinkle, place('sky'));
		if (clouds) {
			const [x, y] = place('sky');
			ctx.drawImage(clouds, x - cloudX, y);
			ctx.drawImage(clouds, x - cloudX + LAYER_W * 2, y);
		}
		drawLayer('skyline');
		if (fogBand) drawFog(150, fogX * 0.5, 1, place('skyline'));
		drawLayer('mid');
		if (fogBand) drawFog(232, -fogX * 0.8, 1, place('mid'));
		drawLayer('left');
		const [ax, ay] = place('left');
		for (const a of actors) drawActor(a, ax, ay);
		drawLayer('right');
		if (fogBand) drawFog(320, fogX, 0.7, place('right'));
		if (drops.length) drawRain();
	}

	function drawTwinkle(tick: number, [x, y]: number[]) {
		stars.forEach(([sx, sy], i) => {
			const r = hash(i * 7919 + tick);
			if (r > 0.18) return;
			ctx.fillStyle = css(colors[r < 0.06 ? INDEX.sky1 : INDEX.cloudLight]);
			ctx.fillRect(x + sx, y + sy, 1, 1);
		});
	}

	function flicker(t: number) {
		if (variant.timeOfDay === 'day' || !windows.length) return;
		if (t < nextFlicker) return;
		nextFlicker = t + 2500 + Math.random() * 3000;
		const switchOff = off.size < 3 && Math.random() < 0.6;
		if (switchOff) off.add(windows[Math.floor(Math.random() * windows.length)]);
		else {
			const first = off.values().next().value;
			if (first) off.delete(first);
		}
	}

	function drawFog(y: number, drift: number, alpha: number, [lx, ly]: number[]) {
		const width = fogBand!.width;
		const x = ((Math.round(drift) % width) + width) % width;
		ctx.globalAlpha = alpha;
		ctx.drawImage(fogBand!, lx - x, ly + y);
		ctx.drawImage(fogBand!, lx - x + width, ly + y);
		ctx.globalAlpha = 1;
	}

	let rainAt = 0;
	function moveDrops(tick: number) {
		const steps = Math.min(tick - rainAt, 10);
		rainAt = tick;
		for (let s = 0; s < steps; s++) {
			for (const d of drops) {
				d.y += d.speed;
				if (d.y > LAYER_H) Object.assign(d, newDrop(-d.length));
			}
		}
	}

	function drawRain() {
		ctx.fillStyle = css(colors[INDEX.trim]);
		for (const d of drops) {
			ctx.globalAlpha = d.near ? 0.75 : 0.4;
			// Wind-slanted streak: one pixel left for every three down.
			for (let i = 0; i < d.length; i++) {
				ctx.fillRect(Math.round(d.x - (d.y + i) / 3) - MARGIN, Math.round(d.y) + i - MARGIN, 1, 1);
			}
		}
		ctx.globalAlpha = 1;
	}

	function drawActor(a: Actor, ox: number, oy: number) {
		const { sheet } = a;
		const x = Math.round(a.x - sheet.cell / 2) + ox;
		const y = Math.round(a.y - sheet.feet[a.frame] - 1) + oy;
		ctx.globalAlpha = a.alpha;
		ctx.drawImage(
			sheet.image,
			a.frame * sheet.cell,
			0,
			sheet.cell,
			sheet.image.height,
			x,
			y,
			sheet.cell,
			sheet.image.height
		);
		ctx.globalAlpha = 1;
	}

	function onPointer(e: PointerEvent) {
		if (e.pointerType !== 'mouse') return;
		pointer.tx = clamp((e.clientX / innerWidth) * 2 - 1);
		pointer.ty = clamp((e.clientY / innerHeight) * 2 - 1);
	}

	let neutral: [number, number] | null = null;
	function onOrientation(e: DeviceOrientationEvent) {
		if (e.gamma === null || e.beta === null) return;
		neutral ??= [e.gamma, e.beta];
		pointer.tx = clamp((e.gamma - neutral[0]) / 20);
		pointer.ty = clamp((e.beta - neutral[1]) / 20);
	}

	return {
		setVariant(timeOfDay: TimeOfDay, weather: Weather) {
			variant = { timeOfDay, weather };
			prepare();
			if (reducedMotion) draw(0);
		},
		destroy() {
			destroyed = true;
			cancelAnimationFrame(raf);
			removeEventListener('pointermove', onPointer);
			removeEventListener('deviceorientation', onOrientation);
		}
	};
}

/* ---------- the chase ---------- */

function chase(t: number, { julia, detective }: Sheets): Actor[] {
	const actors: Actor[] = [];
	const flutter = Math.floor(t / 125) % julia.frames;

	// Julia bounds in from the left, leaps the gap, and hops off the far roof.
	const hops: [number, number, number, number, number, number, number][] = [
		// start ms, end ms, x0, y0, x1, y1, arc height
		[0, 800, -40, LEFT_ROOF_Y, 70, LEFT_ROOF_Y, 8],
		[800, 2000, 70, LEFT_ROOF_Y, 186, RIGHT_ROOF_Y, 30],
		[2000, 2900, 186, RIGHT_ROOF_Y, 290, RIGHT_ROOF_Y, 10]
	];
	for (const [t0, t1, x0, y0, x1, y1, arc] of hops) {
		if (t < t0 || t >= t1) continue;
		const p = (t - t0) / (t1 - t0);
		actors.push({
			sheet: julia,
			frame: flutter,
			x: x0 + (x1 - x0) * p,
			y: y0 + (y1 - y0) * p - arc * 4 * p * (1 - p),
			alpha: 1
		});
	}

	// The detective arrives a moment later, skids at the roof edge and points after her.
	const runStart = 3300;
	const runEnd = 4800;
	const skidEnd = 5200;
	const pointEnd = 7900;
	const fadeEnd = 8500;
	if (t >= runStart && t < runEnd) {
		const p = (t - runStart) / (runEnd - runStart);
		actors.push({
			sheet: detective,
			frame: Math.floor((t - runStart) / 100) % 4,
			x: -detective.cell / 2 + (DETECTIVE_STOP_X - 5 + detective.cell / 2) * p,
			y: LEFT_ROOF_Y,
			alpha: 1
		});
	} else if (t >= runEnd && t < fadeEnd) {
		const skid = Math.min(1, (t - runEnd) / (skidEnd - runEnd));
		const fade = t < pointEnd ? 1 : 1 - Math.ceil(((t - pointEnd) / (fadeEnd - pointEnd)) * 3) / 3;
		actors.push({
			sheet: detective,
			frame: t < skidEnd ? 4 : 5,
			x: DETECTIVE_STOP_X - 5 + 5 * (1 - (1 - skid) * (1 - skid)),
			y: LEFT_ROOF_Y,
			alpha: Math.max(fade, 0)
		});
	}
	return actors;
}

// Reduced motion shows one still moment of the chase instead of the loop.
function tableau({ julia, detective }: Sheets): Actor[] {
	return [
		{ sheet: julia, frame: 0, x: 128, y: (LEFT_ROOF_Y + RIGHT_ROOF_Y) / 2 - 30, alpha: 1 },
		{ sheet: detective, frame: 5, x: DETECTIVE_STOP_X, y: LEFT_ROOF_Y, alpha: 1 }
	];
}

/* ---------- loading and recolouring ---------- */

async function loadPixels(url: string): Promise<ImageData> {
	const blob = await (await fetch(url)).blob();
	const bitmap = await createImageBitmap(blob, {
		colorSpaceConversion: 'none',
		premultiplyAlpha: 'none'
	});
	const c = document.createElement('canvas');
	c.width = bitmap.width;
	c.height = bitmap.height;
	const cx = c.getContext('2d', { willReadFrequently: true })!;
	cx.drawImage(bitmap, 0, 0);
	return cx.getImageData(0, 0, c.width, c.height);
}

async function loadIndexed(url: string): Promise<Indexed> {
	const img = await loadPixels(url);
	const lookup = new Map(NIGHT.map((c, i) => [(c[0] << 16) | (c[1] << 8) | c[2], i]));
	const data = new Uint8Array(img.width * img.height);
	for (let p = 0; p < data.length; p++) {
		const o = p * 4;
		if (img.data[o + 3] < 128) {
			data[p] = TRANSPARENT;
			continue;
		}
		const rgb = (img.data[o] << 16) | (img.data[o + 1] << 8) | img.data[o + 2];
		data[p] = lookup.get(rgb) ?? nearest(img.data[o], img.data[o + 1], img.data[o + 2]);
	}
	return { width: img.width, height: img.height, data };
}

function nearest(r: number, g: number, b: number) {
	let best = 0;
	let bestD = Infinity;
	NIGHT.forEach((c, i) => {
		const d = (c[0] - r) ** 2 + (c[1] - g) ** 2 + (c[2] - b) ** 2;
		if (d < bestD) [best, bestD] = [i, d];
	});
	return best;
}

function paint(layer: Indexed, colors: RGB[]) {
	const c = document.createElement('canvas');
	c.width = layer.width;
	c.height = layer.height;
	const cx = c.getContext('2d')!;
	const img = cx.createImageData(layer.width, layer.height);
	layer.data.forEach((i, p) => {
		if (i === TRANSPARENT) return;
		img.data.set(colors[i], p * 4);
		img.data[p * 4 + 3] = 255;
	});
	cx.putImageData(img, 0, 0);
	return c;
}

// A lit window's "lights out" patch: warm pixels become the dark glass of the unlit windows.
function paintWindowOff(w: Window, colors: RGB[]) {
	const c = document.createElement('canvas');
	c.width = w.w;
	c.height = w.h;
	const cx = c.getContext('2d')!;
	for (const [p, i] of pairs(w.pixels)) {
		const glass =
			i >= INDEX.amber3 ? INDEX.shade2 : i >= INDEX.amber1 ? INDEX.shade1 : INDEX.shade0;
		cx.fillStyle = css(colors[glass]);
		cx.fillRect(p % w.w, Math.floor(p / w.w), 1, 1);
	}
	return c;
}

function pairs(flat: number[]) {
	const out: [number, number][] = [];
	for (let k = 0; k < flat.length; k += 2) out.push([flat[k], flat[k + 1]]);
	return out;
}

function findStars(sky: Indexed): [number, number][] {
	const out: [number, number][] = [];
	sky.data.forEach((i, p) => {
		if (i === INDEX.star) out.push([p % sky.width, Math.floor(p / sky.width)]);
	});
	return out;
}

// Lit windows in the buildings and the gap: connected runs of window-role pixels.
function findWindows(layers: Record<LayerName, Indexed>): Window[] {
	const out: Window[] = [];
	for (const name of ['mid', 'left', 'right'] as const) {
		const { width, height, data } = layers[name];
		const seen = new Uint8Array(data.length);
		for (let p = 0; p < data.length; p++) {
			if (seen[p] || ROLES[data[p]] !== 'window') continue;
			const stack = [p];
			const cells: number[] = [];
			seen[p] = 1;
			while (stack.length) {
				const q = stack.pop()!;
				cells.push(q);
				const x = q % width;
				for (const n of [q - width, q + width, x > 0 ? q - 1 : -1, x < width - 1 ? q + 1 : -1]) {
					if (n < 0 || n >= data.length || seen[n] || ROLES[data[n]] !== 'window') continue;
					seen[n] = 1;
					stack.push(n);
				}
			}
			// Skip specks and the big roof door, which should stay lit.
			if (cells.length < 4 || cells.length > 90) continue;
			const xs = cells.map((q) => q % width);
			const ys = cells.map((q) => Math.floor(q / width));
			const x0 = Math.min(...xs);
			const y0 = Math.min(...ys);
			if (y0 > height - MARGIN * 2) continue;
			const w = Math.max(...xs) - x0 + 1;
			const pixels = cells.flatMap((q) => [
				(Math.floor(q / width) - y0) * w + (q % width) - x0,
				data[q]
			]);
			out.push({ layer: name, x: x0, y: y0, w, h: Math.max(...ys) - y0 + 1, pixels });
		}
	}
	return out;
}

async function loadSheets(): Promise<Sheets> {
	const [julia, detective] = await Promise.all([
		loadSheet('/pixel-art/sprites/julia.png', 3),
		loadSheet('/pixel-art/sprites/detective.png', 6)
	]);
	return { julia, detective };
}

async function loadSheet(url: string, frames: number): Promise<Sheet> {
	const img = await loadPixels(url);
	const cell = Math.floor(img.width / frames);
	// Frames may not sit on the bottom row of their cell; anchor each on its lowest opaque pixel.
	const feet = Array.from({ length: frames }, (_, f) => {
		for (let y = img.height - 1; y >= 0; y--) {
			for (let x = f * cell; x < (f + 1) * cell; x++) {
				if (img.data[(y * img.width + x) * 4 + 3] > 0) return y;
			}
		}
		return img.height - 1;
	});
	const c = document.createElement('canvas');
	c.width = img.width;
	c.height = img.height;
	c.getContext('2d')!.putImageData(img, 0, 0);
	return { image: c, frames, cell, feet };
}

/* ---------- weather ---------- */

// A wrap-around deck of pixel clouds in the variant's cloud colours, drawn over the sky.
function makeClouds(colors: RGB[], heavy: boolean) {
	const width = LAYER_W * 2;
	const height = 216;
	const c = document.createElement('canvas');
	c.width = width;
	c.height = height;
	const cx = c.getContext('2d')!;
	const tones = [INDEX.sky2, INDEX.cloud, INDEX.cloudLight].map((i) => css(colors[i]));
	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			const n = noise(x / 38, y / 13, width / 38) * 0.65 + noise(x / 13, y / 6, width / 13) * 0.35;
			// Densest overhead, thinning toward the horizon.
			const density = n + (1 - y / height) * 0.3 + (heavy ? 0.1 : 0) - 0.08;
			if (density < 0.5) continue;
			// Lit tops, darker undersides: sample the density a little above this pixel.
			const above =
				noise(x / 38, (y - 3) / 13, width / 38) * 0.65 +
				noise(x / 13, (y - 3) / 6, width / 13) * 0.35;
			cx.fillStyle = tones[density > 0.62 && above > n ? 0 : density > 0.58 ? 1 : 2];
			cx.fillRect(x, y, 1, 1);
		}
	}
	return c;
}

// A ragged horizontal band of fog, wrap-around, in the variant's fog colour.
function makeFogBand(colors: RGB[]) {
	const width = LAYER_W * 2;
	const height = 40;
	const c = document.createElement('canvas');
	c.width = width;
	c.height = height;
	const cx = c.getContext('2d')!;
	const tint = colors[INDEX.cloudLight].join();
	for (let x = 0; x < width; x++) {
		const top = Math.round(4 + noise(x / 19, 0.5, width / 19) * 14);
		const bottom = Math.round(height - 4 - noise(x / 27, 3.5, width / 27) * 12);
		for (let y = top; y < bottom; y++) {
			const edge = Math.min(y - top, bottom - y);
			cx.fillStyle = `rgba(${tint},${edge < 3 ? 0.12 : edge < 7 ? 0.22 : 0.32})`;
			cx.fillRect(x, y, 1, 1);
		}
	}
	return c;
}

function newDrop(y: number): Drop {
	const near = Math.random() < 0.4;
	return {
		// Wide enough that the slant still reaches the right-hand edge.
		x: Math.random() * (LAYER_W + LAYER_H / 3),
		y,
		speed: near ? 7 : 4,
		length: near ? 5 : 3,
		near
	};
}

/* ---------- helpers ---------- */

// Smooth value noise that wraps horizontally every `period` units.
function noise(x: number, y: number, period: number) {
	const xi = Math.floor(x);
	const yi = Math.floor(y);
	const fx = x - xi;
	const fy = y - yi;
	const sx = fx * fx * (3 - 2 * fx);
	const sy = fy * fy * (3 - 2 * fy);
	const p = Math.round(period);
	const v = (i: number, j: number) => hash((((i % p) + p) % p) * 374761 + j * 668265);
	const top = v(xi, yi) + (v(xi + 1, yi) - v(xi, yi)) * sx;
	const bottom = v(xi, yi + 1) + (v(xi + 1, yi + 1) - v(xi, yi + 1)) * sx;
	return top + (bottom - top) * sy;
}

function hash(n: number) {
	let h = Math.imul(n ^ 0x9e3779b9, 0x85ebca6b);
	h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35);
	return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

function clamp(v: number) {
	return Math.max(-1, Math.min(1, v));
}

function css([r, g, b]: RGB) {
	return `rgb(${r},${g},${b})`;
}

function needsOrientationPermission() {
	const DOE = globalThis.DeviceOrientationEvent as unknown as { requestPermission?: unknown };
	return !DOE || typeof DOE.requestPermission === 'function';
}
