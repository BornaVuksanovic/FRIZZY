# FRIZZY — QA Testing, Automation & CI/CD Showcase

## [Live Aplikacija](https://frizzy-woad.vercel.app/)

Razvio sam kompletnu Full-stack web aplikaciju za automatizaciju rezervacija u frizerskim salonima. Ovaj projekt izvorno je nastao kao razvojni pothvat, a zatim je transformiran u projekt koji demonstrira produkcijsku razinu QA automatizacije, testne arhitekture i CI/CD integracije.

---

### QA Highlights (Testiranje)

Ovaj repozitorij demonstrira napredne koncepte osiguranja kvalitete i pokriva kompletan testni ciklus:

*   **74 Automatizirana Testa (API & E2E):** Implementirao sam opsežan test suite koristeći **Playwright** (JavaScript).
*   **Data-Driven & Idempotent Arhitektura:** Testovi ne ovise o statičkim podacima. Implementirao sam dinamičko generiranje podataka (npr. Date.now()) i **automatizirani teardown** (čišćenje baze nakon testova) čime se sprječava zagađivanje baze podataka.
*   **Role-Based Access Control & Sigurnosno Testiranje:** Automatizirana provjera prava pristupa za 3 uloge (Admin, Zaposlenik, Klijent), uz striktnu validaciju HTTP statusnih kodova (403).
*   **Backend QA Refactoring:** Tijekom pisanja testova otkriveni su i dokumentirani bugovi. Refaktorirao sam Express kontrolere kako bi backend umjesto generičkih 500 Internal Server Error vraćao semantički ispravne odgovore 400 Bad Request, 404 Not Found.
*   **CI/CD Pipeline:** Postavljen automatizirani integracijski proces (GitHub Actions / Jenkins) koji pokreće kompletne testne pakete pri svakom novom *pushu* koda, osiguravajući ispravnost prije produkcije.
*   **Performance & Load Testiranje:** Koristeći **Apache JMeter** testirana je stabilnost i propusnost ključnih API ruta pod opterećenjem simuliranih korisnika.
*   **Manual QA & Dokumentacija:** Testni procesi i *Test Caseovi* detaljno su dokumentirani u strukturiranim Google Sheets tablicama.

---

### Ključne funkcionalnosti aplikacije

*   **Role-Based Access Control:** Implementirao sam tri razine pristupa (Admin, Zaposlenik, Klijent) s personaliziranim sučeljima i zaštićenim rutama.
*   **Dinamički sustav rezervacija:** Izradio sam interaktivni kalendar s logikom za provjeru dostupnosti termina u stvarnom vremenu (slot management) i filtriranjem po frizerima/uslugama.
*   **Moderni UI/UX:** Dizajnirao sam responzivno sučelje koristeći najnoviji Tailwind v4.
*   **Nadzorna ploča (Dashboard):** Za admin korisnike razvio sam sustav za upravljanje resursima (zaposlenici, cijene, usluge), dok zaposlenici imaju uvid u dnevni raspored s brzim pristupom kontakt podacima klijenata.
*   **State Management & API:** Upravljanje stanjem aplikacije (autentifikacija, tokeni, podaci o terminima) kroz React hookove i asinkronu komunikaciju s backendom.

---

### Tehnološki Stog (Tech Stack)

*   **QA Automatizacija:** Playwright (API & E2E Testiranje), Postman
*   **Performance Testing:** Apache JMeter
*   **CI/CD & DevOps:** GitHub Actions, Jenkins
*   **Test Management:** Google Sheets
*   **Frontend:** React, Vue.js, JavaScript, Tailwind CSS
*   **Backend:** Node.js, Express.js
*   **Baza podataka & ORM:** PostgreSQL (Supabase), Prisma ORM
*   **Sigurnost:** JWT autorizacija, bcrypt enkripcija lozinki
*   **Deployment:** Vercel (Frontend), Render.com (Backend)

---

## GALERIJA

### PLAYWRIGHT TESTOVI
<img width="1004" height="598" alt="image" src="https://github.com/user-attachments/assets/1c6f4a2f-9d7f-4ecd-8c34-ebcdce89b948" />

<img width="993" height="474" alt="image" src="https://github.com/user-attachments/assets/c57f460c-d89d-41f7-a96d-b66001f9aa2f" />

<img width="1005" height="888" alt="image" src="https://github.com/user-attachments/assets/3ad59b6c-4cf5-47fd-84f2-e8eef441d657" />

<img width="1010" height="908" alt="image" src="https://github.com/user-attachments/assets/6d1d2e1c-d4cf-4c5c-87c4-a3b057d988f1" />


<img width="1015" height="251" alt="image" src="https://github.com/user-attachments/assets/96f0145c-1048-4a16-965e-43ed610b12af" />


<img width="1007" height="717" alt="image" src="https://github.com/user-attachments/assets/04561081-d1c6-4ad5-a82f-6a76bb79c674" />

<img width="997" height="525" alt="image" src="https://github.com/user-attachments/assets/3d86eefd-94d9-4b0f-b019-f8f79e5903de" />

<img width="1003" height="581" alt="image" src="https://github.com/user-attachments/assets/a2cd4318-52b5-4734-8409-4891f4c70eca" />





### CLIENT
<img width="1834" height="845" alt="image" src="https://github.com/user-attachments/assets/9cc4c293-803a-40eb-b1fd-269bebfb187b" />

<img width="1882" height="764" alt="image" src="https://github.com/user-attachments/assets/993a1c13-a99f-415b-871a-005134af5e29" />

<img width="598" height="806" alt="image" src="https://github.com/user-attachments/assets/7ef8ced5-d836-464d-96e1-7672c77ac907" />

### ADMIN
<img width="1884" height="705" alt="image" src="https://github.com/user-attachments/assets/ba25ccc2-79d6-46af-9ed6-da065465b43d" />

<img width="1869" height="814" alt="image" src="https://github.com/user-attachments/assets/abf61a73-9df3-4780-9dc8-45bf24259bf8" />

<img width="1898" height="813" alt="image" src="https://github.com/user-attachments/assets/9f1d2065-50aa-4632-b83e-f85a80612b8a" />

### FRIZER
<img width="1876" height="822" alt="image" src="https://github.com/user-attachments/assets/d75c03f3-facd-416d-87e9-bcbef7affbdf" />
