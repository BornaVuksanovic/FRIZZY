import { test, expect } from '@playwright/test';

test.describe("Login API", () => {

  const baseURL = "https://frizzy.onrender.com";

  test("Successful login", async ({ request }) => {
    
    const response = await request.post(`${baseURL}/api/auth/login`, {
      data: {
        username: "test",
        password: "Lozinka123" 
      }
    });

    expect(response.status()).toBe(200);

    const responseJSON = await response.json();

    expect(responseJSON).toHaveProperty("token"); 
    expect(responseJSON).toHaveProperty("user");
    expect(responseJSON.user.username).toBe("test")

  });


  test("Login with missing username", async ({ request }) => {
    
    const response = await request.post(`${baseURL}/api/auth/login`, {
      data: {
        username: "",
        password: "Lozinka123" 
      }
    });

    expect(response.status()).toBe(400);

    const responseJSON = await response.json();

    expect(responseJSON.message).toBe("Missing Username or Password");

  });

  
  test("Login with missing password", async ({ request }) => {
    
    const response = await request.post(`${baseURL}/api/auth/login`, {
      data: {
        username: "test",
        password: "" 
      }
    });

    expect(response.status()).toBe(400);

    const responseJSON = await response.json();
    
    expect(responseJSON.message).toBe("Missing Username or Password");

  });

    
  test("Login with invalid username", async ({ request }) => {
    
    const response = await request.post(`${baseURL}/api/auth/login`, {
      data: {
        username: "Wrong",
        password: "Lozinka123" 
      }
    });

    expect(response.status()).toBe(401);

    const responseJSON = await response.json();
    
    expect(responseJSON.message).toBe("Wrong username or password");

  });


  test("Login with invalid password", async ({ request }) => {
    
    const response = await request.post(`${baseURL}/api/auth/login`, {
      data: {
        username: "test",
        password: "Wrong123" 
      }
    });

    expect(response.status()).toBe(401);

    const responseJSON = await response.json();
    
    expect(responseJSON.message).toBe("Wrong username or password");

  });


  test("Login with empty request body", async ({ request }) => {
    
    const response = await request.post(`${baseURL}/api/auth/login`, {
      data: {}
    });

    expect(response.status()).toBe(400);

    const responseJSON = await response.json();
    
    expect(responseJSON.message).toBe("Missing Username or Password");

  });


  test("Login with SQL injection in username", async ({ request }) => {
    
    const response = await request.post(`${baseURL}/api/auth/login`, {
      data: {
        username: "' OR '1'='1",
        password: "Lozinka123" 
      }
    });

    expect(response.status()).toBe(401);

    const responseJSON = await response.json();
    
    expect(responseJSON.message).toBe("Wrong username or password");

  });

});