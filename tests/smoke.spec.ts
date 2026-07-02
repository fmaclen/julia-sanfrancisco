import { expect, test, type Page } from '@playwright/test';

const settle = async (page: Page) => {
	await page.waitForFunction(() => document.querySelectorAll('main').length === 1);
	await page.waitForTimeout(300);
};

const toggleUntil = async (page: Page, toggleTitle: string, targetSelector: string) => {
	for (let attempt = 0; attempt < 3; attempt++) {
		await page.locator(`button[title*="${toggleTitle}" i]`).first().click();
		try {
			await page.waitForSelector(targetSelector, { timeout: 3000 });
			return;
		} catch {
			continue;
		}
	}
	throw new Error(`${targetSelector} never appeared after clicking ${toggleTitle}`);
};

test('full gameplay smoke', async ({ page }) => {
	test.setTimeout(240_000);

	await test.step('landing renders', async () => {
		await page.goto('/');
		await expect(page.locator('h1').first()).toHaveText('Julia Sanfrancisco');
	});

	await test.step('headquarters: name entry and briefing', async () => {
		await page.locator('a[href*="headquarters"]').first().click();
		await page.waitForSelector('input', { timeout: 15_000 });
		await page.fill('input', 'Winston');

		for (let i = 0; i < 6; i++) {
			if (page.url().includes('/game')) break;
			const nav = page.locator('footer button:not([disabled]), nav button:not([disabled])').last();
			try {
				await nav.click({ timeout: 20_000 });
			} catch {
				break;
			}
			await page.waitForTimeout(400);
		}

		await page.waitForURL('**/game/**', { timeout: 30_000 });
		await settle(page);
	});

	await test.step('game: city and postcard render', async () => {
		await expect(page.locator('h1').first()).not.toHaveText('', { timeout: 10_000 });
	});

	await test.step('game: walk to a place and get a clue', async () => {
		await toggleUntil(page, 'postcard', 'button[title="Walk to"]');
		await page.locator('button[title="Walk to"]').click();
		const places = page.locator('section.button-group button');
		await expect(places.first()).toBeVisible({ timeout: 5000 });
		expect(await places.count()).toBe(3);

		await places.first().click();
		await expect(page.locator('footer strong').first()).toBeVisible({ timeout: 20_000 });
	});

	await test.step('game: fly to a destination', async () => {
		const cityBefore = await page.locator('h1').first().textContent();

		await page.locator('button[title*="back" i]').first().click();
		await page.waitForTimeout(900);
		await page.locator('button[title="Fly to"]').click();

		const destinations = page.locator('section.button-group button');
		await expect(destinations.first()).toBeVisible({ timeout: 5000 });
		expect(await destinations.count()).toBeGreaterThanOrEqual(2);

		await destinations.first().click();
		await page.waitForTimeout(4000);
		await settle(page);

		await expect(page.locator('h1').first()).not.toHaveText(cityBefore ?? '', {
			timeout: 15_000
		});
	});

	await test.step('game: warrant computer', async () => {
		await toggleUntil(page, 'postcard', 'button[title="Options"]');
		await page.locator('button[title="Options"]').click();
		await page.locator('button:has-text("warrant")').first().click();

		const selects = page.locator('select');
		await expect(selects.first()).toBeVisible({ timeout: 20_000 });
		expect(await selects.count()).toBe(5);

		await selects.nth(0).selectOption({ index: 1 });
		await page.locator('button:has-text("Compute")').first().click();
		await expect(page.locator('footer')).toContainText(/suspect/i, { timeout: 10_000 });
	});

	await test.step('probe: reload resumes game from localStorage', async () => {
		const cityBefore = await page.locator('h1').first().textContent();
		await page.reload({ waitUntil: 'networkidle' });
		await settle(page);
		await expect(page.locator('h1').first()).toHaveText(cityBefore ?? '', { timeout: 10_000 });
	});

	await test.step('probe: direct /gg/ visit renders outcome', async () => {
		await page.goto('/gg/');
		await expect(page.locator('footer').first()).toContainText(/police/i, { timeout: 15_000 });
	});

	await test.step('probe: locale switch to Spanish', async () => {
		await page.goto('/');
		await page.locator('button:has-text("🇪🇸")').click();
		await expect(page.locator('body')).toContainText(/Nuevo juego/i, {
			timeout: 10_000
		});
	});
});
