import { test, expect } from '@playwright/test';

test.describe('Login', () => {
    test.beforeEach(async ({page}) => {
        await page.goto('/login');
    });

    test('Successful login test', async ({ page }) => {
        await page.getByPlaceholder('Unesi korisničko ime').fill('test');
        await page.getByPlaceholder('Unesi lozinku').fill('Lozinka123');
        await page.getByRole('button', { name: 'Prijavi se' }).click();

        await expect(page).toHaveURL(/.*createAppointment/)
    });

    test('Login with missing username', async ({page}) => {
        await page.getByPlaceholder('Unesi lozinku').fill('Lozinka123');
        await page.getByRole('button', { name: 'Prijavi se' }).click();

        await expect(page.getByText('Missing Username or Password')).toBeVisible();
    });

    test('Login with missing password', async ({page}) => {
        await page.getByPlaceholder('Unesi korisničko ime').fill('test');
        await page.getByRole('button', { name: 'Prijavi se' }).click();

        await expect(page.getByText('Missing Username or Password')).toBeVisible();
    });

    test('Login with wrong username', async ({page}) => {
        await page.getByPlaceholder('Unesi korisničko ime').fill('Test');
        await page.getByPlaceholder('Unesi lozinku').fill('Lozinka123');
        await page.getByRole('button', { name: 'Prijavi se' }).click();

        await expect(page.getByText('Wrong username or password')).toBeVisible();
    });

    test('Login with wrong password', async ({page}) => {
        await page.getByPlaceholder('Unesi korisničko ime').fill('test');
        await page.getByPlaceholder('Unesi lozinku').fill('Lozinka');
        await page.getByRole('button', { name: 'Prijavi se' }).click();

        await expect(page.getByText('Wrong username or password')).toBeVisible();
    })

});
