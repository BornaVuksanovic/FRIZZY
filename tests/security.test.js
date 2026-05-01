import { test, expect } from '@playwright/test';

test.describe('tests', () => {
    test.beforeEach(async ({page}) => {
        await page.goto('http://localhost:5173/');
    });

    test('Admin panel route', async ({page}) => {

        await page.goto('http://localhost:5173/adminPanel');

        await expect(page).toHaveURL(/.*login/)

    });

});