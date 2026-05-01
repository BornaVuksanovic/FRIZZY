import express from "express";
import dotenv from "dotenv";
import cors from "cors"; // da react moze pricati s backendom
import {PrismaClient} from "@prisma/client";
import authRouter from "./routes/authRoutes.js";
import appRouter from "./routes/appRoutes.js";

dotenv.config();

const app = express();


const prisma = global.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") global.prisma = prisma;

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 1000;

app.use('/api/auth', authRouter);
app.use('/api/app', appRouter);

async function ConnectDB() {
    try {
        await prisma.$queryRaw`SELECT 1`;
        console.log("Uspješno povezan s bazom!");
    } catch (error) {
        console.error("Ne mogu se spojiti:", error);        
    }
}

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
    ConnectDB();
})

export {prisma}