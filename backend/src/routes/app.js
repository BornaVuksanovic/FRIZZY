import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const Prisma = new PrismaClient();


export const registerHairdresser = async (req,res) => {
    try {
        const {username, password, firstName, lastName, phoneNumber, role} = req.body;

        if (password.length < 6){
            return res.status(400).json({ message: "Password less than 6 characters"});
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

export const createService = async (req,res) => {
    try {
        const {name, price, duration} = req.body;

        if (price < 0){
            return res.status(400).json({ message: "Price can't be negatove number"});
        }

        if (duration <= 9){
            return res.status(400).json({ message: "Duration must me at least 10 minutes"});
        }
    
        const service = await Prisma.service.create({data: { name, price, duration}});

        
        res.status(200).json({
            message: "Service successfully created",
            service
        })

    } catch (error) {
        console.log("Error service creation", error);   
        res.status(400).json({
            message: "Service creation failed",
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

export const getServices = async (req,res) => {
    try {  
        const services = await Prisma.service.findMany();

        res.status(200).json({
            message: "List of services",
            services
        })

    } catch (error) {
        res.status(400).json({
            message: "Faild to fetch services",
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