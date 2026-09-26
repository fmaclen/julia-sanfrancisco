import { sveltekit } from '@sveltejs/kit/vite';
import { loadEnv } from 'vite';
import { defineConfig } from 'vitest/config';

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, '.', '');
	return {
		plugins: [sveltekit()],
		server: {
			host: '127.0.0.1',
			port: Number(env.PORT) || 5173,
			strictPort: true,
			allowedHosts: ['.ts.net']
		},
		preview: { host: '127.0.0.1', port: Number(env.PREVIEW_PORT) || 4173, strictPort: true },
		test: {
			include: ['src/**/*.test.ts', 'tests/unit/**/*.test.ts']
		}
	};
});
