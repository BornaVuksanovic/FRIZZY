import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const Prisma = new PrismaClient();

export const protectRoute = async (req,res,next) => {
    try {
        const token = req.header("Authorization").replace("Bearer ", "");
        if ( !token ) res.status(401).json({ message: "No authorization token, access denied"});

        const verifyToken = jwt.verify(token, process.env.JWT_SECRET);

        const user = await Prisma.user.findUnique({
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
