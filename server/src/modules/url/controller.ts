import { Response } from "express";
import { nanoid } from "nanoid";
import db from "../../db";
import { url as urlTable } from "../../db/schema";
import { AuthRequest } from "../auth/middleware";

export const shortenUrlHandler = async (req: AuthRequest, res: Response) => {
    try {
        const { url } = req.body;
        const userId = req.userId;

        if (!url) {
            return res.status(400).json({ message: "URL is required" });
        }

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const shortCode = nanoid(8);

        const [newUrl] = await db
            .insert(urlTable)
            .values({
                url,
                short_code: shortCode,
                user_id: userId,
            })
            .returning();

        return res.status(201).json({
            message: "URL created successfully",
            data: newUrl,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};
