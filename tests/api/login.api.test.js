import { test, expect } from '@playwright/test';

test.describe('API Tests - Login', () => {

  test('Successful login and returns status 200 and token', async ({ request }) => {
    
    const response = await request.post('https://frizzy.onrender.com/api/auth/login', {
      data: {
        username: "test",
        password: "Lozinka123" 
      }
    });

    expect(response.status()).toBe(200);

    const responseJSON = await response.json();

    console.log('Backend odgovor:', responseJSON);

    expect(responseJSON).toHaveProperty('token'); 

    expect(responseJSON.user.username).toBe("test")

  });


  test('Missing username', async ({ request }) => {
    
    const response = await request.post('https://frizzy.onrender.com/api/auth/login', {
      data: {
        username: "",
        password: "Lozinka123" 
      }
    });

    expect(response.status()).toBe(400);

    const responseJSON = await response.json();

    console.log('Backend odgovor:', responseJSON);

    expect(responseJSON.message).toBe("Missing Username or Password");

  });

    test('Missing password', async ({ request }) => {
    
    const response = await request.post('https://frizzy.onrender.com/api/auth/login', {
      data: {
        username: "test",
        password: "" 
      }
    });

    expect(response.status()).toBe(400);

    const responseJSON = await response.json();

    console.log('Backend odgovor:', responseJSON);
    
    expect(responseJSON.message).toBe("Missing Username or Password");

  });

    
  test('Wrong username', async ({ request }) => {
    
    const response = await request.post('https://frizzy.onrender.com/api/auth/login', {
      data: {
        username: "Wrong",
        password: "Lozinka123" 
      }
    });

    expect(response.status()).toBe(401);

    const responseJSON = await response.json();

    console.log('Backend odgovor:', responseJSON);
    
    expect(responseJSON.message).toBe("Wrong username or password");

  });



  test('Wrong password', async ({ request }) => {
    
    const response = await request.post('https://frizzy.onrender.com/api/auth/login', {
      data: {
        username: "test",
        password: "Wrong123" 
      }
    });

    expect(response.status()).toBe(401);

    const responseJSON = await response.json();

    console.log('Backend odgovor:', responseJSON);
    
    expect(responseJSON.message).toBe("Wrong username or password");

  });



  test('XSS username input', async ({ request }) => {
    
    const response = await request.post('https://frizzy.onrender.com/api/auth/login', {
      data: {
        username: "<script>alert(1)</script>",
        password: "Lozinka123" 
      }
    });

    expect(response.status()).toBe(401);

    const responseJSON = await response.json();

    console.log('Backend odgovor:', responseJSON);
    
    expect(responseJSON.message).toBe("Wrong username or password");

  });


  test('SQL Injection username input', async ({ request }) => {
    
    const response = await request.post('https://frizzy.onrender.com/api/auth/login', {
      data: {
        username: "' OR '1'='1",
        password: "Lozinka123" 
      }
    });

    expect(response.status()).toBe(401);

    const responseJSON = await response.json();

    console.log('Backend odgovor:', responseJSON);
    
    expect(responseJSON.message).toBe("Wrong username or password");

  });
});