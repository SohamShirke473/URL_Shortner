import { Response } from "express";
import { nanoid } from "nanoid";
import db from "../../db";
import { url as urlTable } from "../../db/schema";
import { AuthRequest } from "../auth/middleware";
import { eq, and } from "drizzle-orm";

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

export const getUrlsHandler = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const urls = await db.select().from(urlTable).where(eq(urlTable.user_id, userId));
        return res.status(200).json({
            message: "URLs retrieved successfully",
            data: urls,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getUrlbyIdHandler = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const [url] = await db.select().from(urlTable).where(and(eq(urlTable.id, id), eq(urlTable.user_id, userId)));
        if (!url) {
            return res.status(404).json({ message: "URL not found" });
        }
        return res.status(200).json({
            message: "URL retrieved successfully",
            data: url,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteUrlHandler = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const [deletedUrl] = await db.delete(urlTable).where(and(eq(urlTable.id, id), eq(urlTable.user_id, userId))).returning();
        if (!deletedUrl) {
            return res.status(404).json({ message: "URL not found" });
        }
        return res.status(200).json({
            message: "URL deleted successfully",
            data: deletedUrl,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const updateUrlHandler = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const [updatedUrl] = await db.update(urlTable).set({ url: req.body.url }).where(and(eq(urlTable.id, id), eq(urlTable.user_id, userId))).returning();
        if (!updatedUrl) {
            return res.status(404).json({ message: "URL not found" });
        }
        return res.status(200).json({
            message: "URL updated successfully",
            data: updatedUrl,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};
