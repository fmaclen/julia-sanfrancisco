import { browser } from '$app/environment';

export function getRandomValue<T>(array: T[]): T {
	return array[Math.floor(Math.random() * array.length)];
}

export function redirectTo(url: string) {
	if (browser) window.location.href = url;
}

export function getArtworkPath(name: string, folder: 'atlas' | 'places'): string {
	return `/artwork/${folder}/${name.replace(' ', '-').replace(' ', '-').toLowerCase()}.png`;
}

export function delay(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
