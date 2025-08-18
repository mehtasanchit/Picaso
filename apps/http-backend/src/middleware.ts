import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";


// Extend Request type to include userid as ObjectId 
declare global {
    namespace Express {
        interface Request {
            userId?:string;
        }
    }
}

export function middleware(req: Request, res: Response, next: NextFunction) {
    const token = req.headers["authorization"];

    console.log("Authorization header value:", token); // 🔍 See exactly what frontend sends

    if (!token) {
        return res.status(403).json({ message: "Token not provided" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
        req.userId = decoded.userId;
        next();
    } catch (err) {
        //@ts-ignore
        console.error("JWT verification failed:", err.message); // 🔍 Log error reason
        return res.status(403).json({ message: "Invalid or expired token" });
    }
}
