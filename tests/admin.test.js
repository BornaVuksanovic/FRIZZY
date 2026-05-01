import { test, expect } from '@playwright/test';

test.describe('tests', () => {
    test.beforeEach(async ({page}) => {
        await page.goto('/login');

        await page.getByPlaceholder('Unesi korisničko ime').fill('admin');
        await page.getByPlaceholder('Unesi lozinku').fill('admin123');

        await page.getByRole('button', { name: 'Prijavi se'}).click();
  

    });

    test('Successful service creation', async ({page}) => {

        await page.getByRole( 'link', { name: 'Dodaj uslugu'}).click();
        await expect(page.getByText('Kreiraj uslugu')).toBeVisible();

        const uniqueService = `service_${Date.now()}`;
        await page.getByPlaceholder("Unesi naziv usluge").fill(uniqueService);
        await page.getByPlaceholder("Unesi cijenu").fill('10');
        await page.locator('div:has-text("Vremensko trajanje") >> select').selectOption({ index: 1 });

        await page.getByRole('button', { name: 'Kreiraj' }).click();

        await expect(page.getByText('Uspješno kreirana usluga')).toBeVisible();
        await expect(page.getByText(uniqueService)).toBeVisible();
    });

    test('Successul hairdresser creation', async ({page}) => {

        await page.getByRole( 'link', { name: 'Dodaj radnika'}).click();
        await expect(page.getByText('Kreiraj račun frizeru')).toBeVisible();

        const uniqueHairdresser = `hairdresser_${Date.now()}`;
        await page.getByPlaceholder("Unesi korisničko ime").fill(uniqueHairdresser);
        await page.getByPlaceholder("Unesi lozinku").fill('lozinka123');
        const uniqueName = `friz_${Date.now()}`;
        await page.getByPlaceholder("Unesi ime").fill(uniqueName);
        await page.getByPlaceholder("Unesi prezime").fill('frizic');
        await page.getByPlaceholder("Unesi broj telefona").fill('098882156');  

        await page.getByRole('button', { name: 'Kreiraj novog radnika' }).click();

        await expect(page.getByText('Uspješno kreiran korisnik')).toBeVisible();
        await expect(page.getByText(uniqueName)).toBeVisible();
    });
    
    test('Missing field hairdresser creation', async ({page}) => {

        await page.getByRole( 'link', { name: 'Dodaj radnika'}).click();
        await expect(page.getByText('Kreiraj račun frizeru')).toBeVisible();

        //const uniqueHairdresser = `hairdresser_${Date.now()}`;
        //await page.getByPlaceholder("Unesi korisničko ime").fill(uniqueHairdresser);

        await page.getByPlaceholder("Unesi lozinku").fill('lozinka123');
        const uniqueName = `friz_${Date.now()}`;
        await page.getByPlaceholder("Unesi ime").fill(uniqueName);
        await page.getByPlaceholder("Unesi prezime").fill('frizic');
        await page.getByPlaceholder("Unesi broj telefona").fill('098882156');  

        await page.getByRole('button', { name: 'Kreiraj novog radnika' }).click();

        await expect(page.getByText('All fields are required')).toBeVisible();
        await expect(page.getByText('Neuspješno kreiran korisnik')).toBeVisible();
    });


    test('Short username hairdresser creation', async ({page}) => {

        await page.getByRole( 'link', { name: 'Dodaj radnika'}).click();
        await expect(page.getByText('Kreiraj račun frizeru')).toBeVisible();

        await page.getByPlaceholder("Unesi korisničko ime").fill('fr');
        await page.getByPlaceholder("Unesi lozinku").fill('lozinka123');
        const uniqueName = `friz_${Date.now()}`;
        await page.getByPlaceholder("Unesi ime").fill(uniqueName);
        await page.getByPlaceholder("Unesi prezime").fill('frizic');
        await page.getByPlaceholder("Unesi broj telefona").fill('098882156');  
        await page.getByRole('button', { name: 'Kreiraj novog radnika' }).click();

        await expect(page.getByText('Username should be at least 3 characters long')).toBeVisible();
        await expect(page.getByText('Neuspješno kreiran korisnik')).toBeVisible();
    });


    test('Short password hairdresser creation', async ({page}) => {

        await page.getByRole( 'link', { name: 'Dodaj radnika'}).click();
        await expect(page.getByText('Kreiraj račun frizeru')).toBeVisible();

        const uniqueHairdresser = `hairdresser_${Date.now()}`;
        await page.getByPlaceholder("Unesi korisničko ime").fill(uniqueHairdresser);
        await page.getByPlaceholder("Unesi lozinku").fill('Lozi');
        const uniqueName = `friz_${Date.now()}`;
        await page.getByPlaceholder("Unesi ime").fill(uniqueName);
        await page.getByPlaceholder("Unesi prezime").fill('frizic');
        await page.getByPlaceholder("Unesi broj telefona").fill('098882156');  

        await page.getByRole('button', { name: 'Kreiraj novog radnika' }).click();

        await expect(page.getByText('Password less than 6 characters')).toBeVisible();
        await expect(page.getByText('Neuspješno kreiran korisnik')).toBeVisible();
    });
   
    
    test('Existing username hairdresser creation', async ({page}) => {

        await page.getByRole( 'link', { name: 'Dodaj radnika'}).click();
        await expect(page.getByText('Kreiraj račun frizeru')).toBeVisible();

        await page.getByPlaceholder("Unesi korisničko ime").fill('Frizer_Ana');
        await page.getByPlaceholder("Unesi lozinku").fill('Lozinka123');
        const uniqueName = `friz_${Date.now()}`;
        await page.getByPlaceholder("Unesi ime").fill(uniqueName);
        await page.getByPlaceholder("Unesi prezime").fill('frizic');
        await page.getByPlaceholder("Unesi broj telefona").fill('098882156');  

        await page.getByRole('button', { name: 'Kreiraj novog radnika' }).click();

        await expect(page.getByText('Username is already taken')).toBeVisible();
        await expect(page.getByText('Neuspješno kreiran korisnik')).toBeVisible();
    });

});