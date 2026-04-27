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
        if( !username || !password || !firstName || !lastName || !phoneNumber){
            return res.status(400).json({ message: "All fields are required"});
        }

        if (password.length < 6){
            return res.status(400).json({ message: "Password less than 6 characters"});
        }

        if( username.length < 3){
            return res.status(400).json({ message: "Username should be at least 3 characters long" });
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
                message: "Wrong username or password"
            })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if ( !isMatch ){
            return res.status(401).json({
                message: "Wrong username or password"
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
