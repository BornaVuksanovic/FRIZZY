import { test, expect } from '@playwright/test';

test.describe('tests', () => {
    test.beforeEach(async ({page}) => {
        await page.goto('http://localhost:5173/login');
    });

    test('Valid login test', async ({ page }) => {
        await page.getByPlaceholder('Unesi korisničko ime').fill('test');
        await page.getByPlaceholder('Unesi lozinku').fill('Lozinka123');
        await page.getByRole('button', { name: 'Prijavi se' }).click();

        await expect(page).toHaveURL(/.*createAppointment/)
    });

    test('Missing username', async ({page}) => {
        //await page.getByPlaceholder('Unesi korisničko ime').fill('test');
        await page.getByPlaceholder('Unesi lozinku').fill('Lozinka123');
        await page.getByRole('button', { name: 'Prijavi se' }).click();

        await expect(page.getByText('Missing Username or Password')).toBeVisible();
    });

    test('Missing password', async ({page}) => {
        await page.getByPlaceholder('Unesi korisničko ime').fill('test');
        //await page.getByPlaceholder('Unesi lozinku').fill('Lozinka123');
        await page.getByRole('button', { name: 'Prijavi se' }).click();

        await expect(page.getByText('Missing Username or Password')).toBeVisible();
    });

    test('Wrong username', async ({page}) => {
        await page.getByPlaceholder('Unesi korisničko ime').fill('Test');
        await page.getByPlaceholder('Unesi lozinku').fill('Lozinka123');
        await page.getByRole('button', { name: 'Prijavi se' }).click();

        await expect(page.getByText('Wrong username or password')).toBeVisible();
    });

    test('Wrong password', async ({page}) => {
        await page.getByPlaceholder('Unesi korisničko ime').fill('test');
        await page.getByPlaceholder('Unesi lozinku').fill('Lozinka');
        await page.getByRole('button', { name: 'Prijavi se' }).click();

        await expect(page.getByText('Wrong Username or Password')).toBeVisible();
    })

});
