import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";


const prisma = new PrismaClient();


const generateToken = (userId) => {
    return jwt.sign({userId}, process.env.JWT_SECERET, {expiresIn: "15d" });
}

export const register = async (req,res) => {
    try {
        const {username, password, firstName, lastName, phoneNumber} = req.body;

        if (password.length < 6){
            res.status(400).json({ message: "Password less than 6 characters"});
        }

        const user = await prisma.user.create({data: { username, password, firstName, lastName, phoneNumber}});
        
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

export const login = async (req,res) => {
    try {
        const { username, password } = req.body;

        const user = await prisma.user.findUnique({
            where: { username: username}
        });

        if( !user ){
            res.status(401).json({
                message: "User not found"
            })
        }

        res.status(200).json({
            message: "User logged in",
            user
        })

    } catch (error) {
        res.status(400).json({
            message: "error",
            error: error.message
        })
    }
}