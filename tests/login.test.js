import { test, expect } from '@playwright/test';

test('Valid login test', async ({ page }) => {
    await page.goto('http://localhost:5173/login');
    await page.getByPlaceholder('Unesi korisničko ime').fill('test');
    await page.getByPlaceholder('Unesi lozinku').fill('Lozinka123');
    await page.getByRole('button', { name: 'Prijavi se' }).click();

    await expect(page).toHaveURL(/.*createAppointment/)
});