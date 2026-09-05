import { test, expect } from '@playwright/test';

test.describe('API Tests - Protected Routes', () => {

    let adminRequest;
    let clientRequest;
    let hairdresserRequest

    const randomPart = Math.floor(Math.random() * 100000);
    const service = "service_" + randomPart;
    const hairdresser = "hairdresser_" + randomPart;

    const baseURL = 'https://frizzy.onrender.com';

    async function createAuthContext(playwright, username, password) {
        const ctx = await playwright.request.newContext();
        const loginRes = await ctx.post(`${baseURL}/api/auth/login`, {
            data: { username, password }
        });

        expect(loginRes.status()).toBe(200);
        
        const loginResJSON =  await loginRes.json();
        const token = loginResJSON.token;
        expect(token).toBeTruthy();

        return await playwright.request.newContext({
            baseURL,
            extraHTTPHeaders: {
                'Authorization': `Bearer ${token}`
            }
        });
    }


    test.beforeAll(async ({playwright}) => {
        adminRequest = await createAuthContext(playwright, "admin", "admin123");
        clientRequest = await createAuthContext(playwright, "test", "Lozinka123");
        hairdresserRequest = await createAuthContext(playwright, "Frizer_Ana", "Lozinka123")
    });


    test.describe('General protected routes', () => {

        test('Client can fetch services', async () => {    
            const response = await clientRequest.get('/api/app/getServices');

            expect(response.status()).toBe(200);
            const responseJSON = await response.json();
            expect(responseJSON).toHaveProperty('services'); 
        });

        test('Admin can fetch services', async () => {    
            const response = await adminRequest.get('/api/app/getServices');

            expect(response.status()).toBe(200);
            const responseJSON = await response.json();
            expect(responseJSON).toHaveProperty('services'); 
        });

        test('Hairdresser can fetch services', async () => {    
            const response = await hairdresserRequest.get('/api/app/getServices');

            expect(response.status()).toBe(200);
            const responseJSON = await response.json();
            expect(responseJSON).toHaveProperty('services'); 
        });

        test('Unauthenticated request is rejected', async ({ request }) => {
            const response = await request.get(`${baseURL}/api/app/getServices`);
            
            expect(response.status()).toBe(401);
        });

        test('Get hairdressers route', async () => {    
            const response = await clientRequest.get('/api/app/getHairdressers');

            expect(response.status()).toBe(200);
            const responseJSON = await response.json();
            expect(responseJSON).toHaveProperty('hairdressers'); 
        });

        test('Unauthenticated ger hairdressers request is rejected', async ({ request }) => {
            const response = await request.get(`${baseURL}/api/app/getHairdressers`);
            
            expect(response.status()).toBe(401);
        });


        test('Successfully get upcoming appointments for a hairdresser', async () => {
            const hairdressersRes = await hairdresserRequest.get('/api/app/getHairdressers');
            const { hairdressers } = await hairdressersRes.json();
            const validHairdresserId = hairdressers[0].id;

            const response = await hairdresserRequest.get('/api/app/getHairdresserAppointments', {
            params: {
                hairdresserId: validHairdresserId,
                type: 'upcoming'
            }
            });

            expect(response.status()).toBe(200);
            const responseJSON = await response.json();
            expect(responseJSON).toHaveProperty('appointments');
            expect(Array.isArray(responseJSON.appointments)).toBe(true);

        });

        test('Successfully get appointments for today with date parameter', async () => {
            const hairdressersRes = await hairdresserRequest.get('/api/app/getHairdressers');
            const { hairdressers } = await hairdressersRes.json();
            const validHairdresserId = hairdressers[0].id;

            const todayDate = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD

            const response = await hairdresserRequest.get('/api/app/getHairdresserAppointments', {
            params: {
                hairdresserId: validHairdresserId,
                type: 'today',
                date: todayDate
            }
            });

            expect(response.status()).toBe(200);
            const responseJSON = await response.json();
            expect(responseJSON).toHaveProperty('appointments');
        });

 
        test('Missing hairdresser Id - get hairdresser appointments', async () => {
            const response = await hairdresserRequest.get('/api/app/getHairdresserAppointments', {
            params: { type: 'upcoming' }
            });

            expect(response.status()).toBe(400);
            const responseJSON = await response.json();
            expect(responseJSON.message).toBe('Missing hairdresser ID');
        });


        test('Unauthenticated user cannot access hairdresser appointments', async ({ request }) => {
            const response = await request.get('http://localhost:1000/api/app/getHairdresserAppointments', {
            params: { hairdresserId: '2', type: 'upcoming' }
            });

            expect(response.status()).toBe(401);
        });


        test('Client can fetch their appointments with valid clientId', async () => {
            const response = await clientRequest.get('/api/app/getClientAppointments', {
            params: { clientId: '4' }
            });

            expect(response.status()).toBe(200);
            const responseJSON = await response.json();
            
            expect(responseJSON).toHaveProperty('appointments');
            expect(Array.isArray(responseJSON.appointments)).toBe(true);
        });

        test('Admin can fetch appointments for a specific client', async () => {
            const response = await adminRequest.get('/api/app/getClientAppointments', {
            params: { clientId: '4' }
            });

            expect(response.status()).toBe(200);
            const responseJSON = await response.json();
            expect(responseJSON).toHaveProperty('appointments');
        });

        test('Should return 400 when clientId is missing', async () => {
            const response = await clientRequest.get('/api/app/getClientAppointments');

            expect(response.status()).toBe(400);
            const responseJSON = await response.json();
            expect(responseJSON.message).toContain('Missing');
        });

        test('Unauthenticated user is rejected - get client appointments', async ({ request }) => {
            const response = await request.get('http://localhost:1000/api/app/getClientAppointments', {
            params: { clientId: '4' }
            });

            expect(response.status()).toBe(401);
        });
    });



    test.describe('Admin Only Routes', () => {
        test('Successful service creation', async () => {
            const response = await adminRequest.post('/api/app/createService', {
                data: { name: service, duration: 30, price: 15 }
            });
            expect(response.status()).toBe(201);
            const responseJSON = await response.json();
            expect(responseJSON.message).toContain("successfully");
        });

        test('Negative price service creation', async () => {
            const response = await adminRequest.post('/api/app/createService', {
                data: { name: service, duration: 30, price: -20 }
            });
            expect(response.status()).toBe(400);
            const responseJSON = await response.json();
            expect(responseJSON.message).toContain("negative");
        });

        test('Less than 10 minutes service creation', async () => {
            const response = await adminRequest.post('/api/app/createService', {
                data: { name: service, duration: 5, price: 15 }
            });
            expect(response.status()).toBe(400);
            const responseJSON = await response.json();
            expect(responseJSON.message).toBe("Duration must me at least 10 minutes");
        });

        test('Missing name service creation', async () => {
            const response = await adminRequest.post('/api/app/createService', {
                data: { duration: 30, price: 15 }
            });
            expect(response.status()).toBe(400);
            const responseJSON = await response.json();
            expect(responseJSON.message).toContain("Missing");
        });

        test('Missing duration service creation', async () => {
            const response = await adminRequest.post('/api/app/createService', {
                data: { name: service, price: 15 }
            });
            expect(response.status()).toBe(400);
            const responseJSON = await response.json();
            expect(responseJSON.message).toContain("Missing");
        });

        test('Missing price service creation', async () => {
            const response = await adminRequest.post('/api/app/createService', {
                data: { name: service, duration: 30 }
            });
            expect(response.status()).toBe(400);
            const responseJSON = await response.json();
            expect(responseJSON.message).toContain("Missing");
        });

        test('Client can not create service', async () => {
        const response = await clientRequest.post('/api/app/createService', {
            data: { name: 'Hacked Service', duration: 10, price: 0 }
        });
        expect(response.status()).toBe(403); 
        });



        test('Successful hairdresser registration', async () => {
            const response = await adminRequest.post('/api/app/registerHairdresser', {
                data: { 
                    username: hairdresser, 
                    password: "lozinka123", 
                    firstName: "Frizer", 
                    lastName: "Frizeric", 
                    phoneNumber: "987654321", 
                    role: "HAIRDRESSER" 
                }
            });
            expect(response.status()).toBe(201);
            const responseJSON = await response.json();
            expect(responseJSON.message).toContain("successfully");
            expect(responseJSON.user.username).toBe(hairdresser);
        });

        test('Short password hairdresser registration', async () => {
            const response = await adminRequest.post('/api/app/registerHairdresser', {
                data: { 
                    username: hairdresser, 
                    password: "lozi", 
                    firstName: "Frizer", 
                    lastName: "Frizeric", 
                    phoneNumber: "987654321", 
                    role: "HAIRDRESSER" 
                }
            });
            expect(response.status()).toBe(400);
            const responseJSON = await response.json();
            expect(responseJSON.message).toBe("Password less than 6 characters");
        });


        test('Short username hairdresser registration', async () => {
            const response = await adminRequest.post('/api/app/registerHairdresser', {
                data: { 
                    username: "na", 
                    password: "Lozinka123", 
                    firstName: "Frizer", 
                    lastName: "Frizeric", 
                    phoneNumber: "987654321", 
                    role: "HAIRDRESSER" 
                }
            });
            expect(response.status()).toBe(400);
            const responseJSON = await response.json();
            expect(responseJSON.message).toBe("Username should be at least 3 characters long");
        });

        test('Missing field hairdresser registration', async () => {
            const response = await adminRequest.post('/api/app/registerHairdresser', {
                data: { 
                    username: hairdresser, 
                    password: "lozinka123", 
                    //firstName: "Frizer", 
                    lastName: "Frizeric", 
                    phoneNumber: "987654321", 
                    role: "HAIRDRESSER" 
                }
            });
            expect(response.status()).toBe(400);
            const responseJSON = await response.json();
            expect(responseJSON.message).toContain("required");
        });


        test('Client can not register hairdresser', async () => {
            const response = await clientRequest.post('/api/app/registerHairdresser', {
                data: { 
                    username: hairdresser, 
                    password: "lozinka123", 
                    firstName: "Frizer", 
                    lastName: "Frizeric", 
                    phoneNumber: "987654321", 
                    role: "HAIRDRESSER" 
                }
            });
            expect(response.status()).toBe(403); 
        });
    });


    test.describe('Client Only Routes', () => {

        test('Successful appointment creation', async () => {

            const servicesRes = await clientRequest.get('/api/app/getServices');
            const servicesData = await servicesRes.json();
            const validServiceId = servicesData.services[0].id;

            const hairdressersRes = await clientRequest.get('/api/app/getHairdressers');
            const hairdressersData = await hairdressersRes.json();
            const validHairdresserId = hairdressersData.hairdressers[0].id;

            const response = await clientRequest.post('/api/app/createAppointment', {
            data: {
                startDate: '2026-12-01T10:00:00Z',
                clientId: 4, // Poznati klijent ID 
                hairdresserId: validHairdresserId,
                serviceId: validServiceId
            }
            });

            expect(response.status()).toBe(201);
            const responseJSON = await response.json();
            expect(responseJSON).toHaveProperty('appointment');
            
            const createdAppointmentId = responseJSON.appointment.id;
    
            const deleteRes = await clientRequest.delete('/api/app/deleteAppointment', {
                params: { 
                    id: createdAppointmentId 
                }
            });
            
            expect(deleteRes.status()).toBe(200);

        });


        test('Missing field appointment creation', async () => {
            const response = await clientRequest.post('/api/app/createAppointment', {
            data: {
                clientId: 1,
                hairdresserId: 1,
                serviceId: 1
            }
            });

            expect(response.status()).toBe(400);
            const responseJSON = await response.json();
            expect(responseJSON.message).toContain("Missing");
        });


        test('Admin cannot create appointment', async () => {

            const servicesRes = await adminRequest.get('/api/app/getServices');
            const servicesData = await servicesRes.json();
            const validServiceId = servicesData.services[0].id;

            const hairdressersRes = await adminRequest.get('/api/app/getHairdressers');
            const hairdressersData = await hairdressersRes.json();
            const validHairdresserId = hairdressersData.hairdressers[0].id;

            const response = await adminRequest.post('/api/app/createAppointment', {
            data: {
                startDate: '2026-12-01T10:00:00Z',
                clientId: 1, // Poznati klijent ID 
                hairdresserId: validHairdresserId,
                serviceId: validServiceId
            }
            });

            expect(response.status()).toBe(403);
 
        });
    });


     test.describe('Shared routes - Client & Admin', () => {

        test('Client can delete their own appointment', async () => {

            const createRes = await clientRequest.post('/api/app/createAppointment', {
            data: {
                startDate: new Date(Date.now() + 86400000).toISOString(),
                clientId: 4,
                hairdresserId: 2,
                serviceId: 1
            }
            });

            expect(createRes.status()).toBe(201);

            const { appointment } = await createRes.json();

            const deleteRes = await clientRequest.delete('/api/app/deleteAppointment', {
            params: { id: appointment.id }
            });

            expect(deleteRes.status()).toBe(200);
        });

        test('Admin can delete any client appointment', async () => {

            const createRes = await clientRequest.post('/api/app/createAppointment', {
            data: {
                startDate: new Date(Date.now() + 172800000).toISOString(),
                clientId: 4,
                hairdresserId: 2,
                serviceId: 1
            }
            });

            expect(createRes.status()).toBe(201);

            const { appointment } = await createRes.json();

            const deleteRes = await adminRequest.delete('/api/app/deleteAppointment', {
            params: { id: appointment.id }
            });

            expect(deleteRes.status()).toBe(200);
        });


        test('Missing ID appointment deletion', async () => {

            const deleteRes = await clientRequest.delete('/api/app/deleteAppointment');

            expect(deleteRes.status()).toBe(400);
            const resJSON = await deleteRes.json();
            expect(resJSON.message).toContain("Missing");
        });


        test('Unexisting appointment deletion', async () => {

            const deleteRes = await clientRequest.delete('/api/app/deleteAppointment', {
                params: { id: 9999 }
            });

            expect(deleteRes.status()).toBe(404);
            const resJSON = await deleteRes.json();
            expect(resJSON.message).toBe("Appointment not found");
        });

     });
     
});