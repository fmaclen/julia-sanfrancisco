declare global {
	namespace App {
		interface Platform {
			env?: {
				PUBLIC_PLAUSIBLE_DOMAIN: string;
				PUBLIC_GAME_VERSION: string;
			};
		}
	}
}

export {};
