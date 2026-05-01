import { test, expect } from '@playwright/test';

test.describe('tests', () => {
    test.beforeEach(async ({page}) => {
        await page.goto('http://localhost:5173/login');

        await page.getByPlaceholder('Unesi korisničko ime').fill('test');
        await page.getByPlaceholder('Unesi lozinku').fill('Lozinka123');

        await page.getByRole('button', { name: 'Prijavi se'}).click();
  

    });

    test('Successful creation', async ({page}) => {
        await page.locator('div:has-text("Usluga") >> select').first().selectOption({ value: '1' });

        await page.locator('div:has-text("Frizer") >> select').last().selectOption({ value: '6' });

        await page.getByRole('button', { name: 'Dalje' }).click();

        // --- KORAK 2: Odabir datuma i termina ---

        await expect(page.getByText('Odaberi datum i vrijeme')).toBeVisible();

        const dani = page.locator('.react-datepicker__day:not(.react-datepicker__day--disabled):not(.react-datepicker__day--outside-month)');
        await dani.nth(1).click();

        const dostupanTermin = page.locator('button:not([disabled])').filter({ hasText: /^\d{2}:\d{2}$/ }).first();
        await dostupanTermin.click();

        await page.getByRole('button', { name: 'Rezerviraj' }).click();

        await expect(page.getByText('Uspješno kreiran termin')).toBeVisible();
    });

    test('Cancel appointment', async ({page}) => {
        page.once('dialog', async dialog => { // Omogućuje potvrđivanje birsanja van HTML stranice (Window.confirm)
            await dialog.accept(); // Klikne na "Uredu"
        });

        await page.getByRole( 'link', { name: 'Profil'}).click();

        await expect(page.getByText('Odjavi se')).toBeVisible();

        await page.getByRole('button', {name: 'Otkaži'}).first().click();

        await expect(page.getByText('Uspješno obrisan termin')).toBeVisible();

    });

});