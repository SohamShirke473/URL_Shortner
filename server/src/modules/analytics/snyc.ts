import redis from "../../redis"; 
import db from "../../db"; 
import { analytics } from "../../db/schema";
export async function syncAnalyticsToDb() { 
    try {
      const analyticsLogs = await redis.xread(
        "BLOCK",
        5000,
        "STREAMS",
        "analytics_stream",
        "0"
      );

      if (!analyticsLogs) {
        console.log("No new analytics logs...");

      }

      console.log( analyticsLogs);
      console.log(analyticsLogs[0][1]);

    } catch (error) {
      console.error("Error syncing analytics to DB:", error);
    }
  
}
