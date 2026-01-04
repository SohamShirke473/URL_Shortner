import { integer, pgTable, serial, timestamp, varchar, uuid } from "drizzle-orm/pg-core";

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