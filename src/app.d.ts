// REF https://kit.svelte.dev/docs/adapter-cloudflare#deployment

declare global {
	namespace App {
		interface Platform {
			env?: {
				PUBLIC_PLAUSIBLE_DOMAIN: PublicPlausibleDomain;
			};
		}
	}
}

export {};
