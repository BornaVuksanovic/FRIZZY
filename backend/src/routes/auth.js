import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";


const prisma = new PrismaClient();


const generateToken = (userId) => {
    return jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: "15d" });
}

export const register = async (req,res) => {
    try {
        const {username, password, firstName, lastName, phoneNumber} = req.body;

        if (password.length < 6){
            res.status(400).json({ message: "Password less than 6 characters"});
        }

        const hashedPassword = await bcrypt.hash(password, 5);

        const user = await prisma.user.create({data: { username, password: hashedPassword, firstName, lastName, phoneNumber}});

        const token = generateToken(user.id);
        
        res.status(200).json({
            message: "User successfully created",
            user,
            token
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

        if ( !username || !password ){
            return res.status(400).json({
                message: "Missing Username or Password"
            });
        }

        const user = await prisma.user.findUnique({
            where: { username: username}
        });

        if( !user ){
            return res.status(401).json({
                message: "User not found"
            })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if ( !isMatch ){
            return res.status(401).json({
                message: "Login not successfull - wrong password"
            })
        }

        const token = generateToken(user.id);

        res.status(200).json({
            message: "User logged in",
            user,
            token
        })

    } catch (error) {
        console.log("Login error");
        res.status(400).json({
            message: "error",
            error: error.message
        })
    }
}

export const registerHairdresser = async (req,res) => {
    try {
        const {username, password, firstName, lastName, phoneNumber, role} = req.body;

        if (password.length < 6){
            res.status(400).json({ message: "Password less than 6 characters"});
        }

        const hashedPassword = await bcrypt.hash(password, 5);

        const user = await prisma.user.create({data: { username, password: hashedPassword, firstName, lastName, phoneNumber, role}});

        
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