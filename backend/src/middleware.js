import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { prisma } from "./index.js";

export const protectRoute = async (req,res,next) => {
    try {
        const token = req.header("Authorization").replace("Bearer ", "");
        if ( !token ) res.status(401).json({ message: "No authorization token, access denied"});

        const verifyToken = jwt.verify(token, process.env.JWT_SECRET);

        const user = await prisma.user.findUnique({
            where: { id: verifyToken.userId }
        })

        if( !user ) res.status(401).json({ message: "Token is not valid"});

        req.user = user;
        next();

    } catch (error) {
        console.error("Authorization error:", error.message);
        res.status(401).json({ message: "Token is not vlaid, error caught"});
    }
}


export const restrictTo = (...roles) => {
    return (req, res, next) => {
        // req.user je postavljen u prethodnom koraku
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                message: "You don't have permission for this action" 
            });
        }
        next();
    }
}