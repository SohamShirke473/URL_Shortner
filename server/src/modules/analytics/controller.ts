import { AuthRequest } from "../auth/middleware";
import db from "../../db";
import { analytics, url } from "../../db/schema";
import { eq, and, desc } from "drizzle-orm";
import { Response } from "express";

export const getAnalyticsHandler = async (req: AuthRequest, res: Response) => {
    try {
        
        const { id: urlId } = req.params;
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const analyticsData = await db
            .select({
                id: analytics.id,
                ipAddress: analytics.ip_address,
                userAgent: analytics.user_agent,
                clickedAt: analytics.clicked_at,
            })
            .from(analytics)
            .innerJoin(url, eq(analytics.url_id, url.id))
            .where(
                and(
                    eq(url.id, urlId),
                    eq(url.user_id, userId)
                )
            )
            .orderBy(desc(analytics.clicked_at));

        if (analyticsData.length === 0) {
            return res.status(404).json({ message: "No analytics found for this URL" });
        }

        return res.status(200).json({
            message: "Analytics retrieved successfully",
            data: analyticsData,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};
