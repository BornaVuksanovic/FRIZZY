import { test, expect } from '@playwright/test';

test.describe('tests', () => {
    test.beforeEach(async ({page}) => {
        await page.goto('/register');
    });

    test('Valid registration', async ({page}) => {
        const uniqueUser = `user_${Date.now()}`;
        await page.getByPlaceholder('Unesi korisničko ime').fill(uniqueUser);
        await page.getByPlaceholder('Unesi lozinku').fill('lozinka1');
        await page.getByPlaceholder('Unesi ime').fill('ime1');
        await page.getByPlaceholder('Unesi prezime').fill('prezime1');
        await page.getByPlaceholder('Unesi broj telefona').fill('12345678');
        await page.getByRole('button', { name: 'Registriraj se'}).click();

        await expect(page).toHaveURL(/.*createAppointment/);

    });

    test('Short username', async ({page}) => {
        await page.getByPlaceholder('Unesi korisničko ime').fill('re');
        await page.getByPlaceholder('Unesi lozinku').fill('lozinka1');
        await page.getByPlaceholder('Unesi ime').fill('ime1');
        await page.getByPlaceholder('Unesi prezime').fill('prezime1');
        await page.getByPlaceholder('Unesi broj telefona').fill('12345678');
        await page.getByRole('button', { name: 'Registriraj se'}).click();

        await expect(page.getByText('Username should be at least 3 characters long')).toBeVisible();
    
    });

    test('Short password', async ({page}) => {
        await page.getByPlaceholder('Unesi korisničko ime').fill('register1');
        await page.getByPlaceholder('Unesi lozinku').fill('loz');
        await page.getByPlaceholder('Unesi ime').fill('ime1');
        await page.getByPlaceholder('Unesi prezime').fill('prezime1');
        await page.getByPlaceholder('Unesi broj telefona').fill('12345678');
        await page.getByRole('button', { name: 'Registriraj se'}).click();

        await expect(page.getByText('Password less than 6 characters')).toBeVisible();
    
    });

    test('Missing field', async ({page}) => {
        //await page.getByPlaceholder('Unesi korisničko ime').fill('register1');
        await page.getByPlaceholder('Unesi lozinku').fill('lozinka1');
        await page.getByPlaceholder('Unesi ime').fill('ime1');
        await page.getByPlaceholder('Unesi prezime').fill('prezime1');
        await page.getByPlaceholder('Unesi broj telefona').fill('12345678');
        await page.getByRole('button', { name: 'Registriraj se'}).click();

        await expect(page.getByText('All fields are required')).toBeVisible();
    
    });


    test('Existing username', async ({page}) => {
        // Username : register1 exists in database
        await page.getByPlaceholder('Unesi korisničko ime').fill('register1');
        await page.getByPlaceholder('Unesi lozinku').fill('lozinka1');
        await page.getByPlaceholder('Unesi ime').fill('ime1');
        await page.getByPlaceholder('Unesi prezime').fill('prezime1');
        await page.getByPlaceholder('Unesi broj telefona').fill('12345678');
        await page.getByRole('button', { name: 'Registriraj se'}).click();

        await expect(page.getByText('Username is already taken')).toBeVisible();
    
    });

});



