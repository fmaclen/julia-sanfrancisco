import { defineConfig } from '@playwright/test';
import { loadEnv } from 'vite';

const env = loadEnv('test', process.cwd(), '');
const port = Number(env.PREVIEW_PORT) || 4173;

export default defineConfig({
	testDir: 'tests',
	testMatch: '**/*.spec.ts',
	timeout: 240_000,
	use: {
		baseURL: `http://127.0.0.1:${port}`,
		channel: 'chromium',
		viewport: { width: 480, height: 850 },
		screenshot: 'only-on-failure'
	},
	webServer: {
		command: 'bunx typesafe-i18n --no-watch && bun run build && bun run preview',
		port,
		reuseExistingServer: !process.env.CI,
		timeout: 240_000
	}
});
