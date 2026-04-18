import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const Prisma = new PrismaClient();


export const registerHairdresser = async (req,res) => {
    try {
        const {username, password, firstName, lastName, phoneNumber, role} = req.body;

        if (password.length < 6){
            res.status(400).json({ message: "Password less than 6 characters"});
        }

        const hashedPassword = await bcrypt.hash(password, 5);

        const user = await Prisma.user.create({data: { username, password: hashedPassword, firstName, lastName, phoneNumber, role}});

        
        res.status(200).json({
            message: "User successfully created",
            user,
        
        })

    } catch (error) {
        console.log("Greska pri kreitanju usera u bazi", error);   
        res.status(400).json({
            message: "User creation failed",
            error: error.message
        })
    }
}

export const getHairdressers = async (req,res) => {
    try {  
        const hairdressers = await Prisma.user.findMany({
            where: {
                role: "HAIRDRESSER"
            },
            select: {
                id: true,
                firstName: true,
                lastName: true
            }
        });

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

export const testToken = async (req,res) => {
    try {  
        const user = req.user

        res.status(200).json({
            message: "successfull test",
            user
        })

    } catch (error) {
        res.status(400).json({
            message: "unseccessfull test",
            error: error.message
        })
    }
}