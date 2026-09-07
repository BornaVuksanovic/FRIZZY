import { test, expect } from '@playwright/test';

test.describe('Security', () => {
    test.beforeEach(async ({page}) => {
        await page.goto('/');
    });

    test('Navigate to admin panel without login', async ({page}) => {

        await page.goto('/adminPanel');

        await expect(page).toHaveURL(/.*login/)

    });

});