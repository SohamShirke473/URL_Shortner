import { Request, Response } from "express";
import db from "../../db";
import { url as urlTable, analytics } from "../../db/schema";
import { eq } from "drizzle-orm";
import redis from "../../redis"
export async function redirectHandler(req: Request, res: Response) {
    try {
        const { shortCode } = req.params;
        const ip = req.ip;
        const user_agent = req.get("user-agent");
        if (!shortCode) {
            return res.status(400).json({ message: "Short code is required" });
        }
        const cacheKey = `short:${shortCode}`;
        const cachedUrl = await redis.get(cacheKey);
        const analyticsId=await redis.xadd(
            "analytics_stream","*","short_code",shortCode,
            "ip_address",ip||"unknown",
            "user_agent",user_agent||"unknown");
        if (cachedUrl) {
            return res.status(302).redirect(cachedUrl);
        }
        const [url] = await db.select().from(urlTable).where(eq(urlTable.short_code, shortCode));
        if (!url) {
            return res.status(404).json({ message: "URL not found" });
        }
        await redis.set(cacheKey, url.url, "EX", 60 * 60);
        return res.status(302).redirect(url.url);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
}