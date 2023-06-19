import { browser } from '$app/environment';

export function getRandomValue<T>(array: T[]): T {
	return array[Math.floor(Math.random() * array.length)];
}

export function redirectTo(url: string) {
	if (browser) window.location.href = url;
}

export function getArtworkPath(name: string, folder: 'atlas' | 'witnesses'): string {
	const normalized = name.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) => {
		if (+match === 0) return ''; // or if (/\s+/.test(match)) for white spaces
		return index === 0 ? match.toLowerCase() : match.toUpperCase();
	});

	return `/artwork/${folder}/${normalized}.png`;
}

export function delay(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
