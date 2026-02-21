import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const souls = pgTable("souls", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  soulContent: text("soul_content").notNull(),
  memoryContent: text("memory_content").notNull(),
  ownerWallet: text("owner_wallet").notNull(),
  mintAddress: text("mint_address"),
  arweaveHash: text("arweave_hash"),
  soulScore: integer("soul_score").notNull().default(0),
  price: text("price"),
  isListed: boolean("is_listed").notNull().default(false),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSoulSchema = createInsertSchema(souls).omit({
  id: true,
  createdAt: true,
});

export type InsertSoul = z.infer<typeof insertSoulSchema>;
export type Soul = typeof souls.$inferSelect;

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
