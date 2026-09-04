import { test, expect } from '@playwright/test';

test.describe('API Tests - Client registration', () => {

  test('Successful registration', async ({ request }) => {

    const randomPart = Math.floor(Math.random() * 10000);
    const username = "user_" + randomPart;

    const response = await request.post('http://localhost:1000/api/auth/register', {
      data: {
        username: username,
        password: "lozinka123",
        firstName: "Test",
        lastName: "Testic",
        phoneNumber: "0123456789"
      }
    });

    expect(response.status()).toBe(200);

    const responseJSON = await response.json();

    console.log('Backend odgovor:', responseJSON);

    expect(responseJSON).toHaveProperty('token'); 
    expect(responseJSON.user.username).toBe(username);
    expect(responseJSON.message).toBe("User successfully created");

  });


  test('Missing username', async ({ request }) => {

    const response = await request.post('http://localhost:1000/api/auth/register', {
      data: {
        //username: username,
        password: "lozinka123",
        firstName: "Test",
        lastName: "Testic",
        phoneNumber: "0123456789"
      }
    });

    expect(response.status()).toBe(400);

    const responseJSON = await response.json();

    console.log('Backend odgovor:', responseJSON);

    expect(responseJSON.message).toContain("required");

  });


  test('Missing password', async ({ request }) => {

    const randomPart = Math.floor(Math.random() * 10000);
    const username = "user_" + randomPart;

    const response = await request.post('http://localhost:1000/api/auth/register', {
      data: {
        username: username,
        //password: "lozinka123",
        firstName: "Test",
        lastName: "Testic",
        phoneNumber: "0123456789"
      }
    });

    expect(response.status()).toBe(400);

    const responseJSON = await response.json();

    console.log('Backend odgovor:', responseJSON);

    expect(responseJSON.message).toContain("required");

  });


  test('Missing firstName', async ({ request }) => {

    const randomPart = Math.floor(Math.random() * 10000);
    const username = "user_" + randomPart;

    const response = await request.post('http://localhost:1000/api/auth/register', {
      data: {
        username: username,
        password: "lozinka123",
        //firstName: "Test",
        lastName: "Testic",
        phoneNumber: "0123456789"
      }
    });

    expect(response.status()).toBe(400);

    const responseJSON = await response.json();

    console.log('Backend odgovor:', responseJSON);

    expect(responseJSON.message).toContain("required");

  });


  test('Missing lastName', async ({ request }) => {

    const randomPart = Math.floor(Math.random() * 10000);
    const username = "user_" + randomPart;

    const response = await request.post('http://localhost:1000/api/auth/register', {
      data: {
        username: username,
        password: "lozinka123",
        firstName: "Test",
        //lastName: "Testic",
        phoneNumber: "0123456789"
      }
    });

    expect(response.status()).toBe(400);

    const responseJSON = await response.json();

    console.log('Backend odgovor:', responseJSON);

    expect(responseJSON.message).toContain("required");

  });



  test('Missing phoneNumber', async ({ request }) => {

    const randomPart = Math.floor(Math.random() * 10000);
    const username = "user_" + randomPart;

    const response = await request.post('http://localhost:1000/api/auth/register', {
      data: {
        username: username,
        password: "lozinka123",
        firstName: "Test",
        lastName: "Testic",
        //phoneNumber: "0123456789"
      }
    });

    expect(response.status()).toBe(400);

    const responseJSON = await response.json();

    console.log('Backend odgovor:', responseJSON);

    expect(responseJSON.message).toContain("required");

  });


  test('Short password', async ({ request }) => {

    const randomPart = Math.floor(Math.random() * 10000);
    const username = "user_" + randomPart;

    const response = await request.post('http://localhost:1000/api/auth/register', {
      data: {
        username: username,
        password: "ops",
        firstName: "Test",
        lastName: "Testic",
        phoneNumber: "0123456789"
      }
    });

    expect(response.status()).toBe(400);

    const responseJSON = await response.json();

    console.log('Backend odgovor:', responseJSON);

    expect(responseJSON.message).toBe("Password less than 6 characters");

  });


  test('Existing username', async ({ request }) => {

    const response = await request.post('http://localhost:1000/api/auth/register', {
      data: {
        username: "test",
        password: "Lozinka123",
        firstName: "Test",
        lastName: "Testic",
        phoneNumber: "0123456789"
      }
    });

    expect(response.status()).toBe(400);

    const responseJSON = await response.json();

    console.log('Backend odgovor:', responseJSON);

    expect(responseJSON.message).toBe("Username is already taken");

  });


    test('Empty payload', async ({ request }) => {

    const response = await request.post('http://localhost:1000/api/auth/register', {
      data: {

      }
    });

    expect(response.status()).toBe(400);

    const responseJSON = await response.json();

    console.log('Backend odgovor:', responseJSON);

    expect(responseJSON.message).toBe("All fields are required");

  });


    test('XSS username input', async ({ request }) => {

    const response = await request.post('http://localhost:1000/api/auth/register', {
      data: {
        username: "<script>alert(1)</script>",
        password: "Lozinka123",
        firstName: "Test",
        lastName: "Testic",
        phoneNumber: "0123456789"       
      }
    });

    expect(response.status()).toBe(400);

    const responseJSON = await response.json();

    console.log('Backend odgovor:', responseJSON);

    expect(responseJSON.message).toBe("Invalid username input - allowed characters [a-zA-Z0-9_.-]");

  });

});