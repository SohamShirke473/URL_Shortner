import { pgTable, timestamp, varchar, uuid, index } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: varchar("password", { length: 255 }).notNull(),
})

export const url = pgTable("url", {
    id: uuid("id").primaryKey().defaultRandom(),
    url: varchar("url", { length: 225 }).notNull(),
    short_code: varchar("short_code", { length: 8 }).notNull().unique(),
    user_id: uuid("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    created_at: timestamp("created_at").notNull().defaultNow(),
})

export const analytics = pgTable("analytics", {
    id: uuid("id").primaryKey().defaultRandom(),
    url_id: uuid("url_id").notNull().references(() => url.id, { onDelete: "cascade" }),
    ip_address: varchar("ip_address", { length: 255 }).notNull(),
    user_agent: varchar("user_agent", { length: 255 }).notNull(),
    clicked_at: timestamp("clicked_at").notNull().defaultNow(),
},
    (table) => ({
        urlIdx: index("url_analytics_url_idx").on(table.url_id),
        timeIdx: index("url_analytics_time_idx").on(table.clicked_at),
    })
)