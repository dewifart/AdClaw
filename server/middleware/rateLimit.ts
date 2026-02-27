import type { Request, Response, NextFunction } from "express";
import { getConfig } from "../config";

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const clients: Map<string, RateLimitEntry> = new Map();

let cleanupInterval: ReturnType<typeof setInterval> | null = null;

function startCleanup() {
  if (cleanupInterval) return;
  cleanupInterval = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of clients) {
      if (entry.resetAt <= now) {
        clients.delete(key);
      }
    }
  }, 60_000);
}

function getClientKey(req: Request): string {
  const forwarded = req.headers["x-forwarded-for"];
  const ip = typeof forwarded === "string"
    ? forwarded.split(",")[0].trim()
    : req.socket.remoteAddress || "unknown";

  return ip;
}

export function rateLimit(options?: {
  windowMs?: number;
  maxRequests?: number;
  keyPrefix?: string;
}) {
  startCleanup();

  return (req: Request, res: Response, next: NextFunction) => {
    const config = getConfig();
    const windowMs = options?.windowMs || config.RATE_LIMIT_WINDOW_MS;
    const maxRequests = options?.maxRequests || config.RATE_LIMIT_MAX_REQUESTS;
    const prefix = options?.keyPrefix || "global";

    const clientKey = `${prefix}:${getClientKey(req)}`;
    const now = Date.now();

    let entry = clients.get(clientKey);

    if (!entry || entry.resetAt <= now) {
      entry = { count: 0, resetAt: now + windowMs };
      clients.set(clientKey, entry);
    }

    entry.count++;

    const remaining = Math.max(0, maxRequests - entry.count);
    const resetSeconds = Math.ceil((entry.resetAt - now) / 1000);

    res.setHeader("X-RateLimit-Limit", maxRequests);
    res.setHeader("X-RateLimit-Remaining", remaining);
    res.setHeader("X-RateLimit-Reset", resetSeconds);

    if (entry.count > maxRequests) {
      res.setHeader("Retry-After", resetSeconds);
      return res.status(429).json({
        success: false,
        error: "Too many requests",
        retry_after_seconds: resetSeconds,
      });
    }

    next();
  };
}

export function strictRateLimit() {
  return rateLimit({
    windowMs: 60_000,
    maxRequests: 10,
    keyPrefix: "strict",
  });
}

export function getRateLimitStats(): {
  activeClients: number;
  totalEntries: number;
} {
  return {
    activeClients: clients.size,
    totalEntries: Array.from(clients.values()).reduce((sum, e) => sum + e.count, 0),
  };
}
