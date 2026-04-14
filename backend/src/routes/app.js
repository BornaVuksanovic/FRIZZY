import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const tokenTest = async (req,res) => {
    try {
    
        const user = req.user;
  
        res.status(200).json({
            message: "token tested",
            user,
    
        })

    } catch (error) {
        res.status(400).json({
            message: "token test failed",
            error: error.message
        })
    }
}