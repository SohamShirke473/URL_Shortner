import redis from "../../redis";
import db from "../../db";
import { analytics, url } from "../../db/schema";
import { inArray } from "drizzle-orm";

type analyticsLogsTypes = [string, string[]];

function fieldsArrayToObject(fields: string[]) {
  const obj: Record<string, string> = {};

  for (let i = 0; i < fields.length; i += 2) {
    obj[fields[i]] = fields[i + 1];
  }

  return obj;
}

function normalizeLogStream(entries: analyticsLogsTypes[]) {
  return entries.map(([id, fields]) => {
    const data = fieldsArrayToObject(fields);

    const [timestamp] = id.split("-");

    return {
      stream_id: id,
      timestamp: new Date(Number(timestamp)),
      short_code: data.short_code,
      ip_address: data.ip_address,
      user_agent: data.user_agent,
    };
  });
}

let lastStreamId = "0";

export async function syncAnalyticsToDB() {
  try {
    const analyticsLogs = await redis.xread(
      "STREAMS",
      "analytics_stream",
      lastStreamId
    );

    if (!analyticsLogs || analyticsLogs.length === 0 || analyticsLogs[0][1].length === 0) {
      console.log("No new analytics data to sync");
      return;
    }

    const normalizedLogs = normalizeLogStream(analyticsLogs[0][1]);

    lastStreamId = normalizedLogs[normalizedLogs.length - 1].stream_id;

    const shortCodes = [...new Set(normalizedLogs.map(log => log.short_code))];
    const urlMappings = await db
      .select({
        id: url.id,
        short_code: url.short_code,
      })
      .from(url)
      .where(inArray(url.short_code, shortCodes));

    const shortCodeToIdMap = new Map(
      urlMappings.map(u => [u.short_code, u.id])
    );

    const analyticsToInsert = normalizedLogs
      .map(log => {
        const urlId = shortCodeToIdMap.get(log.short_code);
        if (!urlId) {
          console.warn(`URL not found for short_code: ${log.short_code}`);
          return null;
        }
        return {
          url_id: urlId,
          ip_address: log.ip_address,
          user_agent: log.user_agent,
          clicked_at: log.timestamp,
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);

    if (analyticsToInsert.length === 0) {
      console.log("No valid analytics data to insert");
      return;
    }

    await db.insert(analytics).values(analyticsToInsert);

    console.log(`Synced ${analyticsToInsert.length} analytics entries to database`);
  } catch (error) {
    console.error("Error syncing analytics to DB:", error);
  }
}

export async function startAnalyticsWorker(syncIntervalMinutes = 30) {
  const syncIntervalMs = syncIntervalMinutes * 60 * 1000;

  console.log(`Analytics worker started. Syncing to DB every ${syncIntervalMinutes} minutes`);

  await syncAnalyticsToDB();

  setInterval(async () => {
    await syncAnalyticsToDB();
  }, syncIntervalMs);
}