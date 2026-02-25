import { type Soul, type InsertSoul, type ForgeLog, type InsertForgeLog, souls, forgeLogs } from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql } from "drizzle-orm";

export interface IStorage {
  getAllSouls(): Promise<Soul[]>;
  getListedSouls(): Promise<Soul[]>;
  getSoulsByOwner(ownerWallet: string): Promise<Soul[]>;
  getSoulById(id: string): Promise<Soul | undefined>;
  createSoul(soul: InsertSoul): Promise<Soul>;
  updateSoul(id: string, data: Partial<InsertSoul>): Promise<Soul | undefined>;
  createForgeLog(log: InsertForgeLog): Promise<ForgeLog>;
  getRecentForgeLogs(limit?: number): Promise<ForgeLog[]>;
  getFilteredForgeLogs(filters: { wallet?: string; action?: string; category?: string; limit?: number; offset?: number }): Promise<{ logs: ForgeLog[]; total: number }>;
  getForgeLogById(id: string): Promise<ForgeLog | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getAllSouls(): Promise<Soul[]> {
    return db.select().from(souls).orderBy(desc(souls.createdAt));
  }

  async getListedSouls(): Promise<Soul[]> {
    return db.select().from(souls).where(eq(souls.isListed, true)).orderBy(desc(souls.createdAt));
  }

  async getSoulsByOwner(ownerWallet: string): Promise<Soul[]> {
    return db.select().from(souls).where(eq(souls.ownerWallet, ownerWallet)).orderBy(desc(souls.createdAt));
  }

  async getSoulById(id: string): Promise<Soul | undefined> {
    const result = await db.select().from(souls).where(eq(souls.id, id));
    return result[0];
  }

  async createSoul(soul: InsertSoul): Promise<Soul> {
    const result = await db.insert(souls).values(soul).returning();
    return result[0];
  }

  async updateSoul(id: string, data: Partial<InsertSoul>): Promise<Soul | undefined> {
    const result = await db.update(souls).set(data).where(eq(souls.id, id)).returning();
    return result[0];
  }

  async createForgeLog(log: InsertForgeLog): Promise<ForgeLog> {
    const result = await db.insert(forgeLogs).values(log).returning();
    return result[0];
  }

  async getRecentForgeLogs(limit: number = 50): Promise<ForgeLog[]> {
    return db.select().from(forgeLogs).orderBy(desc(forgeLogs.createdAt)).limit(limit);
  }

  async getFilteredForgeLogs(filters: { wallet?: string; action?: string; category?: string; limit?: number; offset?: number }): Promise<{ logs: ForgeLog[]; total: number }> {
    const conditions = [];
    if (filters.wallet) conditions.push(eq(forgeLogs.wallet, filters.wallet));
    if (filters.action) conditions.push(eq(forgeLogs.action, filters.action));
    if (filters.category) conditions.push(eq(forgeLogs.category, filters.category));

    const where = conditions.length > 0 ? and(...conditions) : undefined;
    const limit = Math.min(filters.limit || 50, 100);
    const offset = filters.offset || 0;

    const [logs, countResult] = await Promise.all([
      where
        ? db.select().from(forgeLogs).where(where).orderBy(desc(forgeLogs.createdAt)).limit(limit).offset(offset)
        : db.select().from(forgeLogs).orderBy(desc(forgeLogs.createdAt)).limit(limit).offset(offset),
      where
        ? db.select({ count: sql<number>`count(*)::int` }).from(forgeLogs).where(where)
        : db.select({ count: sql<number>`count(*)::int` }).from(forgeLogs),
    ]);

    return { logs, total: countResult[0]?.count || 0 };
  }

  async getForgeLogById(id: string): Promise<ForgeLog | undefined> {
    const result = await db.select().from(forgeLogs).where(eq(forgeLogs.id, id));
    return result[0];
  }
}

export const storage = new DatabaseStorage();
