import { Router } from "express";
import { db } from "../db";
import { sql } from "drizzle-orm";
import { eventBroadcaster } from "../events";
import { getRateLimitStats } from "../middleware/rateLimit";
import { promotionService } from "../services/agentPromotion";
import { buybackEngine } from "../services/buybackEngine";
import { PLATFORM } from "../config/constants";
import type { HealthCheckResponse, ComponentHealth } from "../types/api";

export const healthRouter = Router();

const startedAt = Date.now();

async function checkDatabase(): Promise<ComponentHealth> {
  const start = Date.now();
  try {
    await db.execute(sql`SELECT 1`);
    return {
      status: "up",
      latency_ms: Date.now() - start,
    };
  } catch (err) {
    return {
      status: "down",
      latency_ms: Date.now() - start,
      details: err instanceof Error ? err.message : "Unknown database error",
    };
  }
}

function checkSSE(): ComponentHealth {
  const clientCount = eventBroadcaster.getClientCount();
  return {
    status: "up",
    details: `${clientCount} connected client${clientCount !== 1 ? "s" : ""}`,
  };
}

function checkMemory(): ComponentHealth {
  const usage = process.memoryUsage();
  const heapUsedMB = Math.round(usage.heapUsed / 1024 / 1024);
  const heapTotalMB = Math.round(usage.heapTotal / 1024 / 1024);
  const rssMB = Math.round(usage.rss / 1024 / 1024);
  const usagePercent = Math.round((usage.heapUsed / usage.heapTotal) * 100);

  return {
    status: usagePercent > 90 ? "degraded" : "up",
    details: `heap: ${heapUsedMB}/${heapTotalMB}MB (${usagePercent}%), rss: ${rssMB}MB`,
  };
}

healthRouter.get("/", async (_req, res) => {
  const [database] = await Promise.all([checkDatabase()]);
  const sse = checkSSE();
  const memory = checkMemory();

  const allUp = database.status === "up" && sse.status === "up" && memory.status === "up";
  const anyDown = database.status === "down" || sse.status === "down";

  const response: HealthCheckResponse = {
    status: anyDown ? "unhealthy" : allUp ? "healthy" : "degraded",
    version: PLATFORM.VERSION,
    uptime_seconds: Math.floor((Date.now() - startedAt) / 1000),
    checks: { database, sse, memory },
  };

  const statusCode = response.status === "unhealthy" ? 503 : 200;
  res.status(statusCode).json(response);
});

healthRouter.get("/detailed", async (_req, res) => {
  const [database] = await Promise.all([checkDatabase()]);
  const sse = checkSSE();
  const memory = checkMemory();
  const rateLimitStats = getRateLimitStats();
  const promotionStats = promotionService.getStats();
  const buybackStats = buybackEngine.getStats();

  res.json({
    platform: PLATFORM,
    uptime_seconds: Math.floor((Date.now() - startedAt) / 1000),
    health: { database, sse, memory },
    rate_limiting: rateLimitStats,
    promotions: promotionStats,
    buybacks: buybackStats,
    node: {
      version: process.version,
      platform: process.platform,
      arch: process.arch,
    },
  });
});
