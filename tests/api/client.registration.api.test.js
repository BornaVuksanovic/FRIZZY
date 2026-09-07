import { test, expect } from '@playwright/test';

test.describe('Client Registration API', () => {

  const baseURL = "https://frizzy.onrender.com";

  const randomPart = Math.floor(Math.random() * 10000);
  const username = "user_" + randomPart;


  test('Successful registration', async ({ request }) => {

    const response = await request.post(`${baseURL}/api/auth/register`, {
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

    expect(responseJSON).toHaveProperty('token'); 
    expect(responseJSON.user.username).toBe(username);
    expect(responseJSON.message).toBe("User successfully created");

  });


  test('Registration with missing username', async ({ request }) => {

    const response = await request.post(`${baseURL}/api/auth/register`, {
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

    expect(responseJSON.message).toBe("All fields are required");

  });


  test('Registration with missing password', async ({ request }) => {

    const response = await request.post(`${baseURL}/api/auth/register`, {
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

    expect(responseJSON.message).toBe("All fields are required");

  });


  test('Registration with missing firstName', async ({ request }) => {

    const response = await request.post(`${baseURL}/api/auth/register`, {
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

    expect(responseJSON.message).toBe("All fields are required");

  });


  test('Registration with missing lastName', async ({ request }) => {

    const response = await request.post(`${baseURL}/api/auth/register`, {
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

    expect(responseJSON.message).toBe("All fields are required");

  });


  test('Registration with missing phoneNumber', async ({ request }) => {

    const response = await request.post(`${baseURL}/api/auth/register`, {
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

    expect(responseJSON.message).toBe("All fields are required");

  });


  test('Registration with short password', async ({ request }) => {

    const response = await request.post(`${baseURL}/api/auth/register`, {
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

    expect(responseJSON.message).toBe("Password less than 6 characters");

  });


  test('Registration with existing username', async ({ request }) => {

    const response = await request.post(`${baseURL}/api/auth/register`, {
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

    expect(responseJSON.message).toBe("Username is already taken");

  });


  test('Registration with empty payload', async ({ request }) => {

    const response = await request.post(`${baseURL}/api/auth/register`, {
      data: {

      }
    });

    expect(response.status()).toBe(400);

    const responseJSON = await response.json();

    expect(responseJSON.message).toBe("All fields are required");

  });

});