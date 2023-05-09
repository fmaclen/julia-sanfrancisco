import { browser } from "$app/environment";

export function getRandomValue<T>(array: T[]): T {
	return array[Math.floor(Math.random() * array.length)];
}

export function redirectTo(url: string) {
	if (browser) window.location.href = url
}
