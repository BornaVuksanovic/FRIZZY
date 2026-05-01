import { test, expect } from '@playwright/test';

test.describe('tests', () => {
    test.beforeEach(async ({page}) => {
        await page.goto('/login');

        await page.getByPlaceholder('Unesi korisničko ime').fill('test');
        await page.getByPlaceholder('Unesi lozinku').fill('Lozinka123');

        await page.getByRole('button', { name: 'Prijavi se'}).click();
  

    });

    test('Logout', async ({page}) => {

        await page.getByRole( 'link', { name: 'Profil'}).click();

        await expect(page.getByText('Odjavi se')).toBeVisible();

        await page.getByRole('button', {name: 'Odjavi se'}).click();

        await expect(page).toHaveURL(/.*login/)

    });

});