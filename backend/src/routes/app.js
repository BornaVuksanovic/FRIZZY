import { PrismaClient } from "@prisma/client";

const Prisma = new PrismaClient();

export const getHairdressers = async (req,res) => {
    try {  
        const hairdressers = await Prisma.user.findMany();

        res.status(200).json({
            message: "List of hairdressers",
            hairdressers
        })

    } catch (error) {
        res.status(400).json({
            message: "Faild to fetch hairdressers",
            error: error.message
        })
    }
}