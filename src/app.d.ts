declare global {
	namespace App {
		interface Platform {
			env?: {
				PUBLIC_PLAUSIBLE_DOMAIN: KVNamespace;
				PUBLIC_GAME_VERSION: KVNamespace;
			};
		}
	}
}

export {};
