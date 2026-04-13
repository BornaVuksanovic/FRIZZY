import express from "express";
import dotenv from "dotenv";
import cors from "cors"; // da react moze pricati s backendom
import {PrismaClient} from "@prisma/client";
import authRouter from "./routes/authRoutes.js";

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 1000;

app.use('/api/auth', authRouter);

async function ConnectDB() {
    try {
        await prisma.$connect();
        console.log("Uspješno povezan s bazom!");
    } catch (error) {
        console.error("Ne mogu se spojiti:", error);        
    }
}

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
    ConnectDB();
})