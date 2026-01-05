import { Router } from "express";
import db from "../../db";
import { url as urlTable } from "../../db/schema";
import { eq } from "drizzle-orm";
import Redis from "ioredis";

export const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD,
});
redis.on("connect", () => {
    console.log("✅ Redis connected");
});

redis.on("error", (err) => {
    console.error("❌ Redis error", err);
});
const router = Router();

router.get("/:shortCode", async (req, res) => {
    try {
        const { shortCode } = req.params;
        if (!shortCode) {
            return res.status(400).json({ message: "Short code is required" });
        }
        const cacheKey = `short:${shortCode}`;
        const cachedUrl = await redis.get(cacheKey);
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
});

export default router;
