import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
    userId?: string;
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction
) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const token = authHeader.split(" ")[1];

        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET not set");
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
            id: string;
        };

        req.userId = decoded.id;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}
