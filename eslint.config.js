import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
	{
		ignores: [
			'.DS_Store',
			'node_modules/**',
			'build/**',
			'.svelte-kit/**',
			'package/**',
			'package-lock.json',
			'vite.config.js.timestamp-*',
			'vite.config.ts.timestamp-*',
			'src/i18n/i18n-svelte.ts',
			'src/i18n/i18n-types.ts',
			'src/i18n/i18n-util.async.ts',
			'src/i18n/i18n-util.sync.ts',
			'src/i18n/i18n-util.ts'
		]
	},
	js.configs.recommended,
	...tseslint.configs.recommended.map((config) => ({
		...config,
		files: ['**/*.{js,ts}']
	})),
	...svelte.configs['flat/recommended'],
	{
		files: ['**/*.svelte'],
		languageOptions: {
			parserOptions: {
				parser: tseslint.parser
			}
		},
		rules: {
			'no-unused-vars': 'off'
		}
	},
	prettier,
	...svelte.configs['flat/prettier'],
	{
		languageOptions: {
			ecmaVersion: 2020,
			sourceType: 'module',
			globals: {
				...globals.browser,
				...globals.node,
				...globals.es2017
			}
		}
	},
	{
		plugins: {
			'@typescript-eslint': tseslint.plugin
		},
		rules: {
			'@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
			'svelte/no-navigation-without-resolve': 'off',
			'svelte/require-each-key': 'off'
		}
	}
);
