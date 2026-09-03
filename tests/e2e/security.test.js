import { test, expect } from '@playwright/test';

test.describe('tests', () => {
    test.beforeEach(async ({page}) => {
        await page.goto('/');
    });

    test('Admin panel route', async ({page}) => {

        await page.goto('/adminPanel');

        await expect(page).toHaveURL(/.*login/)

    });

});