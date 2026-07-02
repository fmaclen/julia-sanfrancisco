import { defineConfig } from '@playwright/test';

export default defineConfig({
	testDir: 'tests',
	testMatch: '**/*.spec.ts',
	timeout: 240_000,
	use: {
		baseURL: 'http://localhost:4173',
		channel: 'chromium',
		viewport: { width: 480, height: 850 },
		screenshot: 'only-on-failure'
	},
	webServer: {
		command: 'npx typesafe-i18n --no-watch && npm run build && npm run preview',
		port: 4173,
		reuseExistingServer: !process.env.CI,
		timeout: 240_000
	}
});
