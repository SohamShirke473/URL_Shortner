import { Router } from "express";
import db from "../../db";
import { url as urlTable } from "../../db/schema";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/:shortCode", async (req, res) => {
    try {
        const { shortCode } = req.params;
        if (!shortCode) {
            return res.status(400).json({ message: "Short code is required" });
        }
        const [url] = await db.select().from(urlTable).where(eq(urlTable.short_code, shortCode));
        if (!url) {
            return res.status(404).json({ message: "URL not found" });
        }
        return res.redirect(url.url);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
});

export default router;
