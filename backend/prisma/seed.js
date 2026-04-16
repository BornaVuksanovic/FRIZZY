import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const Prisma = new PrismaClient();

// kreiranje admina

const hashedPassword = await bcrypt.hash('admin123', 5);

await Prisma.user.create({
    data: {
        username: 'admin',
        password: hashedPassword,
        firstName: 'Borna',
        lastName: 'Vuksanovic',
        phoneNumber: '0971234567',
        role: 'ADMIN'
    }
});

