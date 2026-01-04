import { Request, Response } from "express";
import db from "../../db/index"
import { user } from "../../db/schema"
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function registerController(req: Request, res: Response) {
    try {
        const { email, password, name } = req.body;
        if (!email || !password || !name) {
            return res.status(400).json({ message: "Email, password and name are required" });
        }
        const existingUser = await db.select().from(user).where(eq(user.email, email));
        if (existingUser.length > 0) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const [newuser] = await db
            .insert(user)
            .values({ email, name, password: hashedPassword })
            .returning({ id: user.id, email: user.email })
        return res.status(201).json({ message: "User created successfully", user: newuser });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export async function loginController(req: Request, res: Response) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        const [login_user] = await db.select().from(user).where(eq(user.email, email));
        if (!login_user) {
            return res.status(400).json({ message: "User not found" });
        }
        const isPasswordValid = await bcrypt.compare(password, login_user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid password" });
        }
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET not set");
        }

        const token = jwt.sign(
            { id: login_user.id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );
        return res.status(200).json({
            message: "Login successful", user: {
                id: login_user.id,
                name: login_user.name,
                email: login_user.email,
            }, token
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

